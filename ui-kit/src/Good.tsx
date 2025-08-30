import React, { useEffect, useState } from "react";
import { ColumnProps, Table } from "@v-uik/table";
import { createUseStyles } from "react-jss";
import {Button} from "@v-uik/button";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@v-uik/modal";
import {Input} from "@v-uik/input";
import {InputNumber} from "@v-uik/input-number";
import {ReactComponent as Plus} from "./assets/plus.svg";
import {notification} from "@v-uik/notification";

type GoodItem = {
  id: number;
  name: string;
  price: number;
};

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
});

export function Good(): JSX.Element {
  const classesList = useStyles();

  // Entity field values for modal
  const [selectedGoodName, setSelectedGoodName] = useState("");
  const [selectedGoodPrice, setSelectedGoodPrice] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal states
  const [openCreation, setOpenCreation] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [goods, setGoods] = useState<GoodItem[]>([]);

  // Modal handlers
  const showModalCreation = () => setOpenCreation(true);
  const hideModalCreation = () => setOpenCreation(false);
  const showModalDelete = () => setOpenDelete(true);
  const hideModalDelete = () => setOpenDelete(false);
  const showModalEdit = () => setOpenEdit(true);
  const hideModalEdit = () => setOpenEdit(false);
  
  async function loadData() {
    try {
      const response = await fetch("http://localhost:8080/good");
      const data = await response.json();
      setGoods(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveNewGood() {
    const response = await fetch("http://localhost:8080/good", {
      method: "POST",
      body: JSON.stringify({
        name: selectedGoodName !== "" ? selectedGoodName : null,
        price: selectedGoodPrice !== 0 ? selectedGoodPrice : null
      }),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      }
    });

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
    }

    hideModalCreation();
    await loadData();
  }

  async function deleteGood() {
    if (!selectedId) return;
    
    const response = await fetch(`http://localhost:8080/good/${selectedId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
    }

    hideModalDelete();
    await loadData();
  }

async function updateGood() {
  if (!selectedId) return;
  
  const response = await fetch(`http://localhost:8080/good/${selectedId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: selectedGoodName,
      price: selectedGoodPrice
    }),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
  });

  if (!response.ok) {
    const message = await response.text();
    notification.error(message);
    return;
  }

  hideModalEdit();
  await loadData();
}

const handleEditClick = (item: GoodItem) => {
  setSelectedId(item.id);
  setSelectedGoodName(item.name);
  setSelectedGoodPrice(item.price);
  showModalEdit();
};

  const columns: ColumnProps<GoodItem>[] = [
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
      key: 'price',
      dataIndex: 'price',
      title: 'Цена за штуку',
    },

    {
      key: 'delete',
      dataIndex: 'delete',
      renderCellContent: (thiscell) => (
        <Button
          aria-label="Действие"
          onClick={() => {
            setSelectedId(thiscell.row.id);
            setSelectedGoodName(thiscell.row.name);
            showModalDelete();
          }}
          style={{
            backgroundColor: "red"
          }}>
          Удалить
        </Button>
      ),
    },

   {
  key: 'edit',
  dataIndex: 'edit',
  renderCellContent: (thiscell) => (
    <Button
      aria-label="Редактировать"
      onClick={() => handleEditClick(thiscell.row)}
      style={{ backgroundColor: "blue", marginRight: 8 }}>
      Изменить
    </Button>
  ),
}
  ];

  return (
    <div className={classesList.main}>
      <div className={classesList.buttonWrapper}>
        <Button kind="contained" color="primary" onClick={() => {
          setSelectedGoodName("");
          setSelectedGoodPrice(0);
          showModalCreation();
        }}>
          <Plus style={{ marginRight: 8 }}/>
          Создать
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={goods}
        rowKey="id"
      />

      {/* Create Modal */}
      <Modal open={openCreation} onClose={hideModalCreation}>
        <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
          Добавить новый товар
        </ModalHeader>
        <ModalBody>
          <Input label="Наименование" value={selectedGoodName} onChange={setSelectedGoodName}/>
          <InputNumber label="Цена" value={selectedGoodPrice} onChange={(value: any) => {setSelectedGoodPrice(value)}}/>
        </ModalBody>
        <ModalFooter>
          <Button kind="outlined" onClick={hideModalCreation}>
            Отмена
          </Button>
          <Button onClick={saveNewGood}>Применить</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={hideModalDelete}>
        <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
          Удалить товар
        </ModalHeader>
        <ModalBody>
          Вы действительно хотите удалить <br/><b>{selectedGoodName}</b>?
        </ModalBody>
        <ModalFooter>
          <Button kind="outlined" onClick={hideModalDelete}>
            Отмена
          </Button>
          <Button onClick={deleteGood}>Удалить</Button>
        </ModalFooter>
      </Modal>

  {/* Redactor Modal */}
<Modal open={openEdit} onClose={hideModalEdit}>
  <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
    Редактировать товар
  </ModalHeader>
  <ModalBody>
    <Input label="Наименование" value={selectedGoodName} onChange={setSelectedGoodName}/>
    <InputNumber label="Цена" value={selectedGoodPrice} onChange={(value: any) => {setSelectedGoodPrice(value)}}/>
  </ModalBody>
  <ModalFooter>
    <Button kind="outlined" onClick={hideModalEdit}>
      Отмена
    </Button>
    <Button onClick={updateGood}>Сохранить</Button>
  </ModalFooter>
</Modal>
    </div>
  );
}

export default Good;