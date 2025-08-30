import React, {Component} from "react";
import {ColumnProps, RecordDataSource, Table} from "@v-uik/table";
import {Button} from "@v-uik/button";
import {Select} from "@v-uik/select";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@v-uik/modal";
import {InputNumber} from "@v-uik/input-number";
import {notification} from "@v-uik/notification";

type Good = RecordDataSource<{
    id: number
    name: string
    price: number
}>

type GoodsListRecord = {
    goodId: number
    goodName: string
    goodPrice: number
    count: number
}

interface GoodsListState {
    data: GoodsListRecord[] | null
    goods: { value: string, label: string } []
    goodId: string
    selectedGoodName: string | null
    goodCount: number
    openModalDelete: boolean
    showModalDelete: () => void
    hideModalDelete: () => void
}

interface GoodsListProps {
    deliveryId: number
    openGLModify: boolean
    showModalGLModify: () => void
    hideModalGLModify: () => void
    openGLAdd: boolean
    showModalGLAdd: () => void
    hideModalGLAdd: () => void
    goods?: Good[] | undefined
}

class GoodsList extends Component<GoodsListProps, GoodsListState> {
    columnsGoodsList: ColumnProps<GoodsListRecord>[] = [
        {
            key: 'goodId',
            dataIndex: 'goodId',
            title: '№ товара',
        },
        {
            key: 'goodName',
            dataIndex: 'goodName',
            title: 'Наименование товара',
        },
        {
            key: 'goodPrice',
            dataIndex: 'goodPrice',
            title: 'Цена за штуку',
        },
        {
            key: 'count',
            dataIndex: 'count',
            title: 'Количество',
        },
        {
            key: 'Изменить',
            dataIndex: 'change',
            renderCellContent: (thiscell) => (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button
                        aria-label="Действие"
                        onClick={() => {
                            this.setState({goodId: thiscell.row.goodId.toString()})
                            this.setState({goodCount: thiscell.row.count})
                            this.props.showModalGLModify()
                        }}
                        style={{
                            backgroundColor: "green",
                        }}
                    >
                        Изменить
                    </Button>
                </div>
            ),
        },
        {
            key: 'Удалить',
            dataIndex: 'delete',
            renderCellContent: (thiscell) => (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                <Button
                    aria-label="Действие"
                    onClick={() => {
                        this.setState({goodId: thiscell.row.goodId.toString()})
                        this.setState({selectedGoodName: thiscell.row.goodName})
                        this.state.showModalDelete()
                    }}
                    style={{
                        backgroundColor: "red"
                    }}
                >
                    Удалить
                </Button>
                </div>
            ),
        }
    ]

    constructor(props: GoodsListProps)
    {
        super(props);
        this.state = {
            data: null,
            goods: [],
            goodId: "-1",
            selectedGoodName: null,
            goodCount: 0,
            openModalDelete: false,
            showModalDelete: () => {this.setState({openModalDelete: true})},
            hideModalDelete: () => {this.setState({openModalDelete: false})}
        };
    }

    componentDidMount() {
        this.fetchData();
        this.fetchGoods();
    }

    async fetchData() {
        try {
            const response = await fetch("http://localhost:8080/goodslist/delivery/" + this.props.deliveryId);
            const jsonData = await response.json();
            const result: GoodsListRecord[] = jsonData;

            for (let i = 0; i < jsonData.length; i++) {
                result[i].count = jsonData[i].count
                result[i].goodId = jsonData[i].good.id
                result[i].goodName = jsonData[i].good.name
                result[i].goodPrice = jsonData[i].good.price
            }

            this.setState({data: result});
        } catch (error) {
            console.error("Ошибка при получении данных: ", error);
        }
    }

    async fetchGoods() {
        try {
            const goodsResponse = await fetch("http://localhost:8080/good");
            const goodsJsonData = await goodsResponse.json();
            const goodsResult: Good[] = goodsJsonData;

            for (let i = 0; i < goodsJsonData.length; i++) {
                goodsResult[i].id = goodsJsonData[i].id
                goodsResult[i].name = goodsJsonData[i].name
                goodsResult[i].price = goodsJsonData[i].price
            }

            const optionList = goodsResult.map(val => ({
                value: val.id.toString(),
                label: val.name
            }))

            this.setState({goods: optionList});
        } catch (error) {
            console.error("Ошибка при получении данных: ", error);
        }
    }

    async saveModifiedData(method: string, deliveryId: number, goodId: number, count: number) {
        if (goodId  <= 0 ) {
            notification.error("Выберите товар")
            return
        }

        if (count === 0) {
            notification.error("Введите количество товара")
            return
        }

        const response = await fetch("http://localhost:8080/goodslist", {
            method: method,
            body: JSON.stringify({
                deliveryId: deliveryId,
                goodId: goodId,
                count: count
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

        this.props.hideModalGLModify()
        this.props.hideModalGLAdd()
        await this.fetchData()
    }

    async deletePosition() {
        console.log("http://localhost:8080/goodslist/" + this.state.goodId + "/" + this.props.deliveryId)
        const response = await fetch("http://localhost:8080/goodslist/" + this.state.goodId + "/" + this.props.deliveryId, {
            method: "DELETE"
        })

        if (!response.ok) {
            const message = await response.text()
            notification.error(message)
        }

        this.state.hideModalDelete()
        await this.fetchData()
    }

    render() {
        if (!this.state.data) {
            return <div>Загрузка...</div>
        }

        return (
            <>
                <Table columns={this.columnsGoodsList}
                       dataSource={this.state.data}
                       size="sm"
                       style={{
                           marginRight: "5%",
                           marginLeft: "5%",
                           marginTop: "1%",
                           marginBottom: "1%"
                       }}/>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "1%"
                }}>
                    <Button onClick={() => {
                                this.setState({goodId: "-1", goodCount: 0})
                                this.props.showModalGLAdd();
                            }}
                            style={{
                                marginBottom: "1%"
                            }}>
                        Добавить товар
                    </Button>
                </div>

                <Modal open={this.props.openGLModify} onClose={this.props.hideModalGLModify}>
                    <ModalHeader>
                        Изменить количество
                    </ModalHeader>
                    <ModalBody>
                        <Select options={this.state.goods}
                                onChange={ (value) => this.setState({goodId: value})}
                                value={this.state.goodId}
                                label="Товар"
                                disabled
                        ></Select>
                        <InputNumber label="Количество"
                                     onChange={(value: any) => this.setState({goodCount: value})}
                                     value={this.state.goodCount}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.saveModifiedData("PUT", this.props.deliveryId, +this.state.goodId, this.state.goodCount)}>
                            Сохранить изменения
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal open={this.props.openGLAdd} onClose={this.props.hideModalGLAdd}>
                    <ModalHeader>
                        Добавить товар
                    </ModalHeader>
                    <ModalBody>
                        <Select options={this.state.goods}
                                onChange={ (value) => this.setState({goodId: value})}
                                value={this.state.goodId}
                                label="Товар"
                        ></Select>
                        <InputNumber label="Количество"
                                     onChange={(value: any) => this.setState({goodCount: value})}
                                     value={this.state.goodCount}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.saveModifiedData("POST", this.props.deliveryId, +this.state.goodId, this.state.goodCount)}>
                            Добавить позицию
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal open={this.state.openModalDelete} onClose={this.state.hideModalDelete}>
                    <ModalHeader>
                        Удалить товар
                    </ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить: <br/><b>{this.state.selectedGoodName}</b>?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.deletePosition()}>
                            Удалить
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default GoodsList