import {ColumnProps, RecordDataSource, Table} from "@v-uik/table";
import {createUseStyles} from "react-jss";
import React, {useEffect, useReducer, useState} from "react";
import {Textarea} from "@v-uik/textarea";
import {useLazyQuery} from "@apollo/client";
import {SEARCH_DRAFT_ORDER} from "./graphql_requests";
import {USER_ID} from "./AppProvider";

export function Orders(): JSX.Element {
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

    type Order = RecordDataSource<{
        id: string,
        deliveryAddress: string,
        comment: string,
        orderDateTime: string,
        status: string,
        collector: string,
        courier: string,
        orderList: RecordDataSource<Good>[]
    }>

    type Good = RecordDataSource<{
        id: string,
        name: string,
        count: number,
        price: number,
        priceOverall: number
    }>

    const [orderSource, setOrderSource] = useState<Order[]>([])

    const [expandedRows, setExpandedRows] = useReducer(
        (state: React.Key[], key: React.Key) => {
            const filtered = state.filter((el) => el !== key)

            return filtered.length === state.length ? state.concat(key) : filtered
        },
        []
    )

    const columnsGoods: ColumnProps<Good>[] = [
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
            title: 'Количество',
        },
        {
            key: 'price',
            dataIndex: 'price',
            title: 'Цена за штуку',
        },
        {
            key: 'priceOverall',
            dataIndex: 'priceOverall',
            title: 'Цена общая',
        },
    ]

    const columnsOrders: ColumnProps<Order>[] = [
        {
            key: 'expand',
            kind: 'expand',
            isRowExpanded: ({row}) => expandedRows.includes(row.id),
            renderExpandableContent: (thisrow) => (
                <div style={{backgroundColor: "#e6e6e6", borderRadius: "10px"}}>
                    <div style={{margin: "1%"}}>
                        <p/><b>Сборщик:</b> {orderSource[thisrow.rowIndex].collector}
                        <p/><b>Курьер:</b> {orderSource[thisrow.rowIndex].courier}
                        <p/><Textarea disabled={true} fullWidth={true} label={"Комментарий к заказу"} value={orderSource[thisrow.rowIndex].comment} ></Textarea>
                        <h2>Товарная часть заказа:</h2>
                        <div style={{margin: "1%"}}>
                            <p/><Table columns={columnsGoods} dataSource={orderSource[thisrow.rowIndex].orderList}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1%', marginBottom: '1%'}}>
                            <p/><b>Общая сумма заказа:
                                {orderSource[thisrow.rowIndex].orderList
                                .map(value => value.priceOverall)
                                .reduce((previousValue, currentValue) => currentValue = currentValue + previousValue) + " "}
                            руб.</b>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'id',
            dataIndex: 'id',
            title: '№',
        },
        {
            key: 'deliveryAddress',
            dataIndex: 'deliveryAddress',
            title: 'Адрес'
        },
        {
            key: 'orderDateTime',
            dataIndex: 'orderDateTime',
            title: 'Дата заказа',
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус заказа',
        }
    ]

    const [loadDataMessage, setLoadDataMessage] = useState("")
    const [loadOrders] = useLazyQuery(SEARCH_DRAFT_ORDER)
    async function loadData() {
        const orders = await loadOrders({
            variables: {
                cond: "it.customer.entityId == '" + USER_ID + "' && it.status != 'DRAFT'"
            },
            fetchPolicy: "no-cache"
        })

        if (orders.loading) {
            return
        }

        if (orders.error) {
            console.log(orders.error.message)
            setLoadDataMessage(orders.error.message)
            return
        }

        setOrderSource(orders.data.searchOrder.elems.map((value:any) => ({
            id: value.id,
            deliveryAddress: "г. " + value.deliveryAddress.city + " ул. " + value.deliveryAddress.street + " "
                + value.deliveryAddress.building + " д. " + value.deliveryAddress.flatNumber,
            comment: value.comment,
            orderDateTime: value.orderDateTime,
            status: value.status,
            courier: value.courier,
            collector: value.collector,
            orderList: value.orderListList.elems.map((products:any) => ({
                id: products.product.entity.id,
                name: products.product.entity.name,
                count: products.count,
                price: products.product.entity.price,
                priceOverall: Number((products.product.entity.price * products.count).toFixed(2))
            }))
        })))

        setLoadDataMessage("")
    }

    useEffect(() => {
        loadData()
    }, [])

    if (loadDataMessage !== "") {
        return  <div className={classesList.main}>
                    <p>Возникла ошибка при загрузке заказов: {loadDataMessage}</p>
                </div>
    }

    return <>
        <div className={classesList.main}>
            <Table dataSource={orderSource}
                   columns={columnsOrders}
                   onChange={(params) => {
                    if (params.type === 'expand') {
                        setExpandedRows(params.row.id)
                    }
            }}/>
        </div>
    </>
}

export default Orders