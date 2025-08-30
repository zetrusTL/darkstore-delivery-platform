import {ColumnProps, RecordDataSource, Table} from "@v-uik/table";
import {InputNumber} from "@v-uik/input-number";
import {Button} from "@v-uik/button";
import React, {useEffect, useState} from "react";
import {createUseStyles} from "react-jss";
import {DatePicker} from "@v-uik/date-picker";
import {Input} from "@v-uik/input";
import {Textarea} from "@v-uik/textarea";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    DELETE_ORDER,
    DELETE_PRODUCT_IN_ORDER,
    SEARCH_DRAFT_ORDER,
    UPDATE_CUSTOMER,
    UPDATE_ORDER
} from "./graphql_requests";
import {USER_ID} from "./AppProvider";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@v-uik/modal";
import {notification} from "@v-uik/notification";

export function Cart(): JSX.Element {
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

    const [openModalDeleteProduct, setOpenModalDeleteProduct] = useState(false)
    function showModalDeleteProduct() { setOpenModalDeleteProduct(true) }
    function hideModalDeleteProduct() { setOpenModalDeleteProduct(false) }

    const [productToDelete, setProductToDelete] = useState("")
    const [orderListToDelete, setOrderListToDelete] = useState("")

    const [deleteProduct] = useMutation(DELETE_PRODUCT_IN_ORDER)
    async function deleteProductInOrder() {

        if (cartSource.length <= 1) {
            await deleteOrder()
            return
        }

        const deletedProduct = await deleteProduct({
            variables: {
                orderListId: orderListToDelete
            }
        })

        hideModalDeleteProduct()
        await loadData()
    }

    const [openModalDeleteOrder, setOpenModalDeleteOrder] = useState(false)
    function showModalDeleteOrder() { setOpenModalDeleteOrder(true) }
    function hideModalDeleteOrder() { setOpenModalDeleteOrder(false) }

    const [orderId, setOrderId] = useState("")

    const [dsDeleteOrder] = useMutation(DELETE_ORDER)
    async function deleteOrder() {
        const deletedOrder = await dsDeleteOrder({
            variables: {
                orderId: orderId
            }
        })

        hideModalDeleteOrder()
        await loadData()
    }

    const [cartSource, setCartSource] = useState<Cart[]>([])

    const columnsCart: ColumnProps<Cart>[] = [
        {
            key: 'productId',
            dataIndex: 'productId',
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
            renderCellContent: (thiscell) => (
                <InputNumber value={cartSource[thiscell.rowIndex].count} precision={0}/>
            ),
        },
        {
            key: 'pricePerPiece',
            dataIndex: 'pricePerPiece',
            title: 'Цена за штуку',
        },
        {
            key: 'priceOverall',
            dataIndex: 'priceOverall',
            title: 'Цена общая',
        },
        {
            key: 'delete',
            dataIndex: 'delete',
            renderCellContent: (thiscell) => (
                <Button style={{backgroundColor: "red"}} onClick={() => {
                    setProductToDelete(thiscell.row.name)
                    setOrderListToDelete(thiscell.row.orderId)
                    showModalDeleteProduct()
                }}>Удалить</Button>
            ),
        },
    ]

    const [overallPrice, setOverallPrice] = useState(0)
    const [selectedDate, setSelectedDate] = useState<any>(new Date())
    const [userCity, setUserCity] = useState("")
    const [userStreet, setUserStreet] = useState("")
    const [userBuilding, setUserBuilding] = useState("")
    const [userFlatNumber, setUserFlatNumber] = useState("")
    const [userName, setUserName] = useState("")
    const [userSurname, setUserSurname] = useState("")
    const [orderComment, setOrderComment] = useState("")

    type OrderList = {
        id: string,
        count: number,
        product: {
            entity: {
                id: string
                name: string,
                price: number,
                description: string
            }
        }
    }

    type Cart = RecordDataSource<{
        orderId: string,
        productId: string,
        name: string,
        count: number,
        pricePerPiece: number,
        priceOverall: number
    }>

    const [sendOrder] = useMutation(UPDATE_ORDER);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    async function orderProducts() {
        if (!userCity) {
            notification.error("Введите город")
            return
        }
        if (!userStreet) {
            notification.error("Введите улицу")
            return
        }
        if (!userFlatNumber) {
            notification.error("Введите номер дома")
            return
        }
        if (!userName) {
            notification.error("Введите имя получателя")
            return
        }
        if (!userSurname) {
            notification.error("Введите фамилию получателя")
            return
        }
        if (!selectedDate) {
            notification.error("Введите дату")
            return
        }

        const customer = await updateCustomer({
            variables: {
                customerId: USER_ID,
                customerCity: userCity,
                customerStreet: userStreet,
                customerBuilding: userBuilding,
                customerFlatNumber: userFlatNumber,
                customerFirstName: userName,
                customerLastName: userSurname
            }
        })

        if (customer.errors) {
            console.log(customer.errors)
        }

        const date = selectedDate.toISOString()

        const orderRequest = await sendOrder({
            variables: {
                orderId: orderId,
                deliveryCity: userCity,
                deliveryStreet: userStreet,
                deliveryBuilding: userBuilding,
                deliveryFlatNumber: userFlatNumber,
                deliveryDate: date.slice(0, date.length - 5),
                customerId: USER_ID,
                orderComment: orderComment
            }
        })

        if (orderRequest.errors) {
            console.log(orderRequest.errors)
        }

        await loadData()
    }

    const [loadDraftOrder] = useLazyQuery(SEARCH_DRAFT_ORDER)
    const [loadDataMessage, setLoadDataMessage] = useState("")

    async function loadData() {
        setOrderId("")

        const response = await loadDraftOrder({
            variables: {
                cond: "it.customer.entityId == '" + USER_ID + "' && it.status == 'DRAFT'"
            },
            fetchPolicy: "no-cache"
        })

        if (response.loading) {
            setLoadDataMessage("Идет загрузка корзины...")
            return
        }

        if (response.error) {
            setLoadDataMessage("Ошибка: " + response.error.message)
            return
        }

        if (response.data.searchOrder.elems.length === 0) {
            return
        }

        const order = response.data.searchOrder.elems[0]

        setOrderId(order.id)
        setUserCity(order.customer.entity.deliveryAddress.city)
        setUserStreet(order.customer.entity.deliveryAddress.street)
        setUserBuilding(order.customer.entity.deliveryAddress.building)
        setUserFlatNumber(order.customer.entity.deliveryAddress.flatNumber)

        setUserName(order.customer.entity.personalData.firstName)
        setUserSurname(order.customer.entity.personalData.lastName)

        setSelectedDate(order.orderDateTime ? order.orderDateTime : new Date())
        setOrderComment(order.comment)

        const products: OrderList[] = order.orderListList.elems
        setCartSource(products.map(value => ({
            orderId: value.id,
            productId: value.product.entity.id,
            name: value.product.entity.name,
            count: value.count,
            pricePerPiece: value.product.entity.price,
            priceOverall: Number((value.product.entity.price * value.count).toFixed(2))
        })).sort((a, b) => a.productId > b.productId ? 1 : -1))

        setOverallPrice(products.map(value => value.product.entity.price * value.count)
            .reduce((previousValue, currentValue) => currentValue = currentValue + previousValue))

        setLoadDataMessage("")

        return <></>
    }

    useEffect(() => {
        loadData()
    }, [])

    if (!orderId) {
        return  <div className={classesList.main}>
                    <p>{loadDataMessage.length === 0 ? "Корзина пуста" : loadDataMessage}</p>
                </div>
    }

    return  <>
                <div className={classesList.main}>
                    <h2>Детали заказа: </h2>
                    <div style={{margin: "1%"}}>
                        <div>
                            <Input value={userCity} onChange={setUserCity} label={"Город: "} style={{marginRight: 5}}/>
                            <Input value={userStreet} onChange={setUserStreet} label={"Улица: "} style={{marginRight: 5}}/>
                            <Input value={userBuilding} onChange={setUserBuilding} label={"Строение: "} style={{marginRight: 5}}/>
                            <Input value={userFlatNumber} onChange={setUserFlatNumber} label={"Дом: "} style={{marginRight: 5}}/>
                        </div>
                        <div>
                            <Input value={userName} onChange={setUserName} label={"Имя: "} style={{marginRight: 5}}/>
                            <Input value={userSurname} onChange={setUserSurname} label={"Фамилия: "} style={{marginRight: 5}}/>
                        </div>
                        <div>
                            <DatePicker value={selectedDate}
                                        onChange={setSelectedDate}
                                        label={"Дата заказа:"}
                                        format="dd.MM.yyyy" mask="11.11.1111"
                            />
                        </div>
                    </div>
                    <div>
                        <Table dataSource={cartSource}
                               columns={columnsCart}/>

                        <div style={{display: "flex", justifyContent: "right", margin: "1%"}}>
                            <h3>Сумма заказа: {overallPrice} руб.</h3>
                        </div>

                        <Textarea label={"Комментарий к заказу"} fullWidth={true} style={{marginBottom: "1%"}} value={orderComment} onChange={setOrderComment}/>

                        <div style={{display: "flex", justifyContent: "right"}}>
                            <div style={{justifyContent: "left", margin: "1%"}}>
                                <Button style={{backgroundColor: "red"}} onClick={showModalDeleteOrder}>Отменить заказ</Button>
                            </div>

                            <div style={{justifyContent: "right", margin: "1%"}}>
                                <Button onClick={orderProducts}>Оформить заказ</Button>
                            </div>
                        </div>

                    </div>
                </div>

                <Modal open={openModalDeleteProduct} onClose={hideModalDeleteProduct}>
                    <ModalHeader>
                        Удалить товар
                    </ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить: <br/><b>{productToDelete}</b>?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => deleteProductInOrder()}>
                            Удалить
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal open={openModalDeleteOrder} onClose={hideModalDeleteOrder}>
                    <ModalHeader>
                        Отмена заказа
                    </ModalHeader>
                    <ModalBody>
                        Вы действительно хотите отменить заказ?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => deleteOrder()}>
                            Да
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
}

export default Cart