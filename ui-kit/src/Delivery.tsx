import {createUseStyles} from "react-jss";
import React, {useEffect, useState} from "react";
import {ColumnProps, RecordDataSource, Table} from "@v-uik/table";
import {Button} from "@v-uik/button";
import {ReactComponent as Plus} from "./assets/plus.svg";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@v-uik/modal";
import {InputNumber} from "@v-uik/input-number";
import {DatePicker} from "@v-uik/date-picker";
import GoodsList from "./GoodsList";
import {Select} from "@v-uik/select";
import {notification} from "@v-uik/notification";

export function Delivery(): JSX.Element {
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

    function clearState() {
        setSelectedDate(new Date())
        setSelectedStatus("")
        setSelectedDarkstore("")
        setSelectedId(0)
    }

    //Modal
    const [open, setOpen] = React.useState(false)
    const showModal = () => setOpen(true)
    const hideModal = () => {
        clearState()
        setOpen(false)
    }

    //Modal - add new record
    const [openAdd, setOpenAdd] = React.useState(false)
    const showModalAdd = () => setOpenAdd(true)
    const hideModalAdd = () => {
        clearState()
        setOpenAdd(false)
    }

    //Modal - delete selected record
    const [openDelete, setOpenDelete] = useState(false)
    const showModalDelete = () => setOpenDelete(true)
    const hideModalDelete = () => setOpenDelete(false)

    //Modal - GoodsList
    const [openGLModify, setOpenGLModify] = React.useState(false)
    const showModalGLModify = () => setOpenGLModify(true)
    const hideModalGLModify = () => setOpenGLModify(false)

    //Modal - GoodsList
    const [openGLAdd, setOpenGLAdd] = React.useState(false)
    const showModalGLAdd = () => setOpenGLAdd(true)
    const hideModalGLAdd = () => setOpenGLAdd(false)

    const [delivery, setDelivery] = React.useState([])
    const [darkstore, setDarkstore] = React.useState([])

    const [selectedStatus, setSelectedStatus] = React.useState("")
    const [selectedDarkstore, setSelectedDarkstore] = React.useState("")
    const [selectedDate, setSelectedDate] = React.useState<any>(new Date())
    const [selectedId, setSelectedId] = React.useState(0)

    type DeliverySource = RecordDataSource<{
        id: number
        deliveryDatetime: string
        address: string
        darkstoreId: string
        status: string
    }>

    const deliverySource: DeliverySource[] = []

    function ShowDeliveries() {
        useEffect(() => {
            async function fetchData() {
                const responseData = fetch("http://localhost:8080/delivery")
                    .then(response => response.json())

                setDelivery(await responseData)
            }

            fetchData()
        }, []);

        for (let i: number = 0; i < delivery.length; i++) {
            deliverySource[i] = delivery[i]

            // @ts-ignore
            deliverySource[i].status = translateStatusRus(delivery[i].status)
            // @ts-ignore
            deliverySource[i].address = delivery[i].darkstore.address
            // @ts-ignore
            deliverySource[i].darkstoreId = delivery[i].darkstore.id.toString()
        }
    }

    function LoadDarkstores() {
        useEffect(() => {
            async function fetchData() {
                const responseData = await fetch("http://localhost:8080/darkstore")
                    .then(response => response.json())

                // @ts-ignore
                setDarkstore(responseData.map(val => ({value: val.id.toString(), label: val.address})))
            }

            fetchData()
        }, []);
    }

    const [expandedRows, setExpandedRows] = React.useReducer(
        (state: React.Key[], key: React.Key) => {
            const filtered = state.filter((el) => el !== key)

            return filtered.length === state.length ? state.concat(key) : filtered
        },
        []
    )

    const columnsDelivery: ColumnProps<DeliverySource>[] = [
        {
            key: 'expand',
            kind: 'expand',

            isRowExpanded: ({row}) => expandedRows.includes(row.id),
            renderExpandableContent: (thisrow) => (
                <GoodsList deliveryId={thisrow.row.id}
                           openGLModify={openGLModify}
                           showModalGLModify={showModalGLModify}
                           hideModalGLModify={hideModalGLModify}
                           openGLAdd={openGLAdd}
                           showModalGLAdd={showModalGLAdd}
                           hideModalGLAdd={hideModalGLAdd}
                />),
        },
        {
            key: 'id',
            dataIndex: 'id',
            title: '№',
        },
        {
            key: 'address',
            dataIndex: 'address',
            title: 'Адрес',
        },
        {
            key: 'deliveryDatetime',
            dataIndex: 'deliveryDatetime',
            title: 'Дата заказа',
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
        },
        {
            key: 'Изменить',
            dataIndex: 'change',
            renderCellContent: (thiscell) => (
                <Button
                    aria-label="Действие"
                    onClick={() => {
                        setSelectedId(thiscell.row.id)
                        setSelectedDate(new Date(Date.parse(thiscell.row.deliveryDatetime)))
                        setSelectedStatus(getStatusNumber(thiscell.row.status))
                        setSelectedDarkstore(deliverySource[thiscell.rowIndex].darkstoreId)
                        showModal()
                    }}
                >
                    Изменить
                </Button>
            ),
        },
        {
            key: 'Удалить',
            dataIndex: 'delete',
            renderCellContent: (thiscell) => (
                <Button
                    aria-label="Действие"
                    onClick={() => {
                        setSelectedId(thiscell.row.id)
                        showModalDelete()
                    }}
                    style={{
                        backgroundColor: "red"
                    }}
                >
                    Удалить
                </Button>
            ),
        }
    ]


    const handleChange = React.useCallback(
        (value: Date) => {
            setSelectedDate(value)
        },
        [setSelectedDate]
    )

    const options = [
        { value: '1', label: 'Принят' },
        { value: '2', label: 'В сборке' },
        { value: '3', label: 'Доставка' },
        { value: '4', label: 'Завершен' },
        { value: '5', label: 'Отменен' },
    ]

    function mapStatusOption(value: string): string {
        switch (value) {
            case "1": return "SUBMITTED"
            case "2": return "ASSEMBLY"
            case "3": return "DELIVERY"
            case "4": return "COMPLETED"
            case "5": return "CANCELLED"
        }

        return value
    }

    function translateStatusRus(value: string): string {
        switch (value) {
            case "SUBMITTED": return 'Принят'
            case "ASSEMBLY": return 'В сборке'
            case "DELIVERY": return 'Доставка'
            case "COMPLETED": return 'Завершен'
            case "CANCELLED": return 'Отменен'
        }

        return value
    }

    function getStatusNumber(value: string): string {
        switch (value) {
            case 'Принят': return "1"
            case 'В сборке': return "2"
            case 'Доставка': return "3"
            case 'Завершен': return "4"
            case 'Отменен': return "5"
        }

        return value
    }

    async function loadData() {
        await fetch("http://localhost:8080/delivery")
            .then(response => response.json())
            .then(response => setDelivery(response))

        for (let i: number = 0; i < delivery.length; i++) {
            deliverySource[i] = delivery[i]
            // @ts-ignore
            deliverySource[i].status = translateStatusRus(delivery[i].status)
            // @ts-ignore
            deliverySource[i].address = delivery[i].darkstore.address
            // @ts-ignore
            deliverySource[i].darkstoreId = delivery[i].darkstore.id.toString()
        }
    }

    async function saveNewDelivery(method: string) {
        if (selectedId <= 0 && method === "PUT") {
            notification.error("Не выбран заказ")
            return
        }

        if (selectedDarkstore === "" || selectedDarkstore === null) {
            notification.error("Не выбран адрес доставки")
            return
        }

        if (selectedDate === null) {
            notification.error("Не выбрана дата доставки")
            return
        }

        if (selectedStatus === "") {
            notification.error("Не выбран статус заказа")
            return
        }

        const response = await fetch("http://localhost:8080/delivery", {
            method: method,
            body: JSON.stringify({
                id: selectedId,
                darkstoreId: +selectedDarkstore,
                deliveryDateTime: selectedDate,
                status: mapStatusOption(selectedStatus)
            }),
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            }
        })

        if (!response.ok) {
            const message = await response.text()
            notification.error(message)
        }

        //ShowDeliveries()
        await loadData()
        hideModalAdd()
        hideModal()
    }


    async function deleteDelivery() {
        const response = await fetch("http://localhost:8080/delivery/" + selectedId, {
            method: "DELETE"
        })

        if (!response.ok) {
            const message = await response.text()
            notification.error(message)
        }

        hideModalDelete()
        await loadData()
    }

    ShowDeliveries()
    LoadDarkstores()

    return <>
        <div className={classesList.main}>
            <div className={classesList.buttonWrapper}>
                <Button kind="contained" color="primary" onClick={showModalAdd}>
                    <Plus
                        style={{
                            marginRight: 8,
                        }}/>
                    Создать
                </Button>
            </div>

            <Table hoverable
                   columns={columnsDelivery}
                   dataSource={deliverySource}
                   onChange={(params) => {
                       if (params.type === 'expand') {
                           setExpandedRows(params.row.id)
                       }
                   }}
                   bordered="rows"
            />

            <Modal open={open} onClose={hideModal}>
                <ModalHeader
                    subtitle="Additional subtitle"
                    closeButtonProps={{
                        'aria-label': 'Close modal',
                    }}
                >
                {/** ИЗМЕНИТЬ - убрать subtitle и изменить Modal title */}
                    Modal title
                </ModalHeader>
                <ModalBody>
                    <InputNumber precision={0} label="Id" value={selectedId} disabled={true}/>
                    <DatePicker label="Дата заказа" value={selectedDate} onChange={ (value) => setSelectedDate(value)} format="dd.MM.yyyy" mask="11.11.1111"/>
                    <Select label = "Адрес" value={selectedDarkstore} options={darkstore} onChange={ (value) => setSelectedDarkstore(value)}/>
                    <Select label="Статус" value={selectedStatus} options={options} onChange={ (value) => setSelectedStatus(value)}/>
                </ModalBody>
                <ModalFooter>
                    <Button kind="outlined" onClick={hideModal}>
                        Отмена
                    </Button>
                    <Button onClick={() => saveNewDelivery("PUT")}>Применить</Button>
                </ModalFooter>
            </Modal>

            <Modal open={openAdd} onClose={hideModalAdd}>
                <ModalHeader
                    closeButtonProps={{
                        'aria-label': 'Close modal',
                    }}
                >
                    Создать заказ
                </ModalHeader>
                <ModalBody>
                    <DatePicker label="Дата заказа" value={selectedDate} onChange={ (value) => setSelectedDate(value)} format="dd.MM.yyyy" mask="11.11.1111"/>
                    <Select label = "Адрес" value={selectedDarkstore} options={darkstore} onChange={ (value) => setSelectedDarkstore(value)}/>
                    <Select label="Статус" value={selectedStatus} options={options} onChange={ (value) => setSelectedStatus(value)}/>
                </ModalBody>
                <ModalFooter>
                    <Button kind="outlined" onClick={hideModalAdd}>
                        Отмена
                    </Button>
                    <Button onClick={() => saveNewDelivery("POST")}>Применить</Button>
                </ModalFooter>
            </Modal>

            <Modal open={openDelete} onClose={hideModalDelete}>
                <ModalHeader
                    closeButtonProps={{
                        'aria-label': 'Close modal',
                    }}
                >
                    Удалить заказ
                </ModalHeader>
                <ModalBody>
                    Вы уверены, что хотите удалить заказ № {selectedId}?
                </ModalBody>
                <ModalFooter>
                {/** ИЗМЕНИТЬ - вместо hideModalAdd надо hideModalDelete */}
                    <Button kind="outlined" onClick={hideModalAdd}>
                        Отмена
                    </Button>
                    <Button onClick={() => deleteDelivery()}>Удалить</Button>
                </ModalFooter>
            </Modal>
        </div>
    </>
}

export default Delivery