import {Select} from "@v-uik/select"
import React, {useEffect, useReducer, useState} from "react";
import {createUseStyles} from "react-jss";
import {Button} from "@v-uik/button";
import {ColumnProps, RecordDataSource, Table} from "@v-uik/table";
import {InputNumber} from "@v-uik/input-number";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    ADD_PRODUCT_TO_ORDER,
    CREATE_ORDER,
    GET_ALL_DARKSTORES,
    GET_ALL_PRODUCTS_BY_DARKSTORE,
    SEARCH_DRAFT_ORDER,
    SEARCH_PRODUCT_IN_ORDER,
    UPDATE_PRODUCT_COUNT
} from "./graphql_requests";
import {USER_ID} from "./AppProvider";
import {notification} from "@v-uik/notification";

export function Goods(): JSX.Element {
    const useStyles = createUseStyles({
        main: {
            backgroundColor: '#fff',
            margin: [112, 16, 0, 16],
            borderRadius: 5,
            padding: 32,
        },
        buttonWrapper: {
            display: 'flex',
            marginBottom: 16,
            justifyContent: 'flex-end',
        }
    })

    const classesList = useStyles()

    type Darkstore = {
        id?: number,
        darkstoreAddress: {
            city: string,
            street: string,
            building?: string,
            flatNumber: string
        }
    }

    function DarkstoreSelection() {
        const response = useQuery(GET_ALL_DARKSTORES)
        let optionList = [{value: "1", label: "Идет загрузка"}]

        if (response.loading) {
            return <></>
        }

        if (response.error) {
            console.log(response.error.message)
            return <></>
        }

        if (response.data.searchDarkstore) {
            const darkstores: Darkstore[] = response.data.searchDarkstore.elems

            optionList = darkstores.map(val => ({
                //@ts-ignore
                value: val.id.toString(),
                label: "г. " + val.darkstoreAddress.city
                    + " ул. " + val.darkstoreAddress.street
                    + " д." + val.darkstoreAddress.flatNumber
                    + " " + val.darkstoreAddress.building
            }))
        }

        return <Select value={selectedDarkstore}
                       options={optionList}
                       onChange={(value) => setSelectedDarkstore(value)}
                       label={"Выберите склад"}/>
    }

    type DarkstoreProductsResponse = {
        count: number
        product: {
            entity: Good
        }
    }

    const [goodSource, setGoodSource] = useState<Good[]>([])
    const [loadProducts] = useLazyQuery(GET_ALL_PRODUCTS_BY_DARKSTORE)
    const [loadProductsMessage, setLoadProductsMessage] = useState("")
    async function loadData() {
        const products = await loadProducts(
            {
                variables: {
                    cond: "it.darkstore.id == '" + selectedDarkstore + "'"
                }})

        if (products.loading) {
            return
        }

        if (products.error) {
            console.error(products.error.message)
            setLoadProductsMessage("Возникла ошибка при загрузке данных:" + products.error.message)
            return
        }

        const response:DarkstoreProductsResponse[] = products.data.searchDarkstoreList.elems

        setGoodSource(response.map(value => ({
            id: value.product.entity.id,
            name: value.product.entity.name,
            count: value.count,
            price: value.product.entity.price,
            description: value.product.entity.description
        })))

        setLoadProductsMessage("")
    }

    type Good = RecordDataSource<{
        id: string,
        name: string,
        count: number,
        price: number,
        description: string
    }>

    const [selectedDarkstore, setSelectedDarkstore] = useState("1")
    const [countMap, setCountMap] = useState(new Map())

    const [expandedRows, setExpandedRows] = useReducer(
        (state: React.Key[], key: React.Key) => {
            const filtered = state.filter((el) => el !== key)

            return filtered.length === state.length ? state.concat(key) : filtered
        },
        []
    )

    async function addProductToCart(productId:string, productCount:number) {
        if (productId === "" || productCount === 0) {
            notification.error("Не указано количество товара или не выбран товар. ")
            setDisableButtons(false)
            return
        }

        let draftOrders = await getOrderWithDraftStatus()

        if (draftOrders.loading) {
            setDisableButtons(false)
            return
        }

        if (draftOrders.error) {
            notification.error("При добавлении товара возникла ошибка: " + draftOrders.error.message)
            console.log(draftOrders.error.message)
            setDisableButtons(false)
            return
        }

        let orderId:string

        //Если корзина пуста
        if (draftOrders.data.searchOrder.elems.length === 0) {
            const newOrder = await createOrder()
            orderId = newOrder.data.packet.createOrder.id
        } else {
            orderId = draftOrders.data.searchOrder.elems[0].id
        }

        const product = await searchProduct({
            variables: {
                cond: "it.product.entityId == '" + productId + "' && it.order.id == '" + orderId + "'"
            }
        })

        if (product.error !== undefined) {
            notification.error("При добавлении товара возникла ошибка: " + product.error.message)
            console.log(product.error.message)
            return
        }

        let orderList = product.data.searchOrderList.elems

        //Добавить продукт, если его нет в заказе
        //Если есть - изменить количество
        if (orderList.length === 0) {
            const addProductRequest = await addProductToOrder({
                variables: {
                    productId: productId,
                    orderId: orderId,
                    productCount: productCount
                }
            })
        } else {
           const updatedProductCount = await updateProductCount({
               variables: {
                   orderID: orderId,
                   orderListId: orderList[0].id,
                   productId: productId,
                   productCount: productCount
               }
           })
        }

        setCountMap(new Map(countMap).set(productId, 0))
        setDisableButtons(false)
        notification.success("Товар был добавлен в корзину.")
    }

    const [getOrderWithDraftStatus] = useLazyQuery(SEARCH_DRAFT_ORDER,
        {
            variables: {
                cond: "it.customer.entityId == '" + USER_ID + "' && it.status == 'DRAFT'"
            },
            fetchPolicy: "no-cache"
        })

    const [createOrder] = useMutation(CREATE_ORDER,
        {
            variables: {
                customerId: USER_ID
            }
        })

    const [searchProduct] = useLazyQuery(SEARCH_PRODUCT_IN_ORDER)
    const [addProductToOrder] = useMutation(ADD_PRODUCT_TO_ORDER)
    const [updateProductCount] = useMutation(UPDATE_PRODUCT_COUNT)

    const [disableButtons, setDisableButtons] = useState(false)

    const columnsGoods: ColumnProps<Good>[] = [
        {
            key: 'expand',
            kind: 'expand',
            isRowExpanded: ({row}) => expandedRows.includes(row.id),
            renderExpandableContent: (thisrow) => (
                <><p/>{goodSource[thisrow.rowIndex].description}<p/></>),
        },
        {
            key: 'id',
            dataIndex: 'id',
            title: '№',
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование товара',
        },
        {
            key: 'count',
            dataIndex: 'count',
            title: 'Остаток',
        },
        {
            key: 'Изменить',
            dataIndex: 'change',
            title: 'Количество к заказу',
            renderCellContent: (thiscell) => (
                <InputNumber value={countMap.get(thiscell.row.id)} onChange={
                    (value:any) => setCountMap(new Map(countMap).set(thiscell.row.id, value))}/>
            ),
        },
        {
            key: 'Удалить',
            dataIndex: 'delete',
            renderCellContent: (thiscell) => (
                <Button
                    aria-label="Действие"
                    onClick={() => {
                        setDisableButtons(true)
                        addProductToCart(thiscell.row.id, countMap.get(thiscell.row.id))
                    }}
                    disabled={disableButtons}
                >
                    Добавить в корзину
                </Button>
            ),
        }
    ]

    useEffect(() => {
        loadData()
    }, [selectedDarkstore])

    if (loadProductsMessage !== "") {
        return  <div className={classesList.main}>
                    <p>{loadProductsMessage}</p>
                </div>
    }

    return <>
        <div className={classesList.main}>
            <div className={classesList.buttonWrapper}>
                <DarkstoreSelection/>
            </div>
            <Table dataSource={goodSource}
                   columns={columnsGoods}
                   onChange={(params) => {
                       if (params.type === 'expand') {
                           setExpandedRows(params.row.id)
                       }
                   }}/>
        </div>
    </>
}

export default Goods