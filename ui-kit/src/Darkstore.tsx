import React, { useEffect, useState } from "react";
import { ColumnProps, Table } from "@v-uik/table";
import { createUseStyles } from "react-jss";
import {Button} from "@v-uik/button";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@v-uik/modal";
import {Input} from "@v-uik/input";
import {InputNumber} from "@v-uik/input-number";
import {ReactComponent as Plus} from "./assets/plus.svg";
import {notification} from "@v-uik/notification";

type DarkstoreItem = {
  id: number;
  address: string;
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

export function Darkstore(): JSX.Element {
  const classesList = useStyles();

  // Entity field values for modal
  const [selectedDarkstoreName, setSelectedDarkstoreName] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal states
  const [openCreation, setOpenCreation] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [darkstores, setDarkstore] = useState<DarkstoreItem[]>([]);

  // Modal handlers
  const showModalCreation = () => setOpenCreation(true);
  const hideModalCreation = () => setOpenCreation(false);
  const showModalDelete = () => setOpenDelete(true);
  const hideModalDelete = () => setOpenDelete(false);
  const showModalEdit = () => setOpenEdit(true);
  const hideModalEdit = () => setOpenEdit(false);
  
  async function loadData() {
    try {
      const response = await fetch("http://localhost:8080/darkstore");
      const data = await response.json();
      setDarkstore(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveNewDarkstore() {
    const response = await fetch("http://localhost:8080/darkstore", {
      method: "POST",
      body: JSON.stringify({
        address: selectedDarkstoreName !== "" ? selectedDarkstoreName : null,
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

  async function deleteDarkstore() {
    if (!selectedId) return;
    
    const response = await fetch(`http://localhost:8080/darkstore/${selectedId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const message = await response.text();
      notification.error(message);
    }

    hideModalDelete();
    await loadData();
  }

async function updateDarkstore() {
  if (!selectedId) return;
  
  const response = await fetch(`http://localhost:8080/darkstore/${selectedId}`, {
    method: "PUT",
    body: JSON.stringify({
      address: selectedDarkstoreName,
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

const handleEditClick = (item: DarkstoreItem) => {
  setSelectedId(item.id);
  setSelectedDarkstoreName(item.address);
  showModalEdit();
};

  const columns: ColumnProps<DarkstoreItem>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: '№',
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: 'Адресс',
    },


    {
      key: 'delete',
      dataIndex: 'delete',
      renderCellContent: (thiscell) => (
        <Button
          aria-label="Действие"
          onClick={() => {
            setSelectedId(thiscell.row.id);
            setSelectedDarkstoreName(thiscell.row.address);
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
          setSelectedDarkstoreName("");
          showModalCreation();
        }}>
          <Plus style={{ marginRight: 8 }}/>
          Создать
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={darkstores}
        rowKey="id"
      />

      {/* Create Modal */}
      <Modal open={openCreation} onClose={hideModalCreation}>
        <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
          Добавить новый адресс
        </ModalHeader>
        <ModalBody>
          <Input label="Наименование" value={selectedDarkstoreName} onChange={setSelectedDarkstoreName}/>
        </ModalBody>
        <ModalFooter>
          <Button kind="outlined" onClick={hideModalCreation}>
            Отмена
          </Button>
          <Button onClick={saveNewDarkstore}>Применить</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={hideModalDelete}>
        <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
          Удалить адрес
        </ModalHeader>
        <ModalBody>
          Вы действительно хотите удалить <br/><b>{selectedDarkstoreName}</b>?
        </ModalBody>
        <ModalFooter>
          <Button kind="outlined" onClick={hideModalDelete}>
            Отмена
          </Button>
          <Button onClick={deleteDarkstore}>Удалить</Button>
        </ModalFooter>
      </Modal>

  {/* Redactor Modal */}
<Modal open={openEdit} onClose={hideModalEdit}>
  <ModalHeader closeButtonProps={{ 'aria-label': 'Close modal' }}>
    Редактировать адрес
  </ModalHeader>
  <ModalBody>
    <Input label="Наименование" value={selectedDarkstoreName} onChange={setSelectedDarkstoreName}/>
  </ModalBody>
  <ModalFooter>
    <Button kind="outlined" onClick={hideModalEdit}>
      Отмена
    </Button>
    <Button onClick={updateDarkstore}>Сохранить</Button>
  </ModalFooter>
</Modal>
    </div>
  );
}

export default Darkstore;