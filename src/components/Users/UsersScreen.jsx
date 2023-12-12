import React, { useState, useEffect } from "react";
import { Collapse, Badge, Button, List, Modal, Input, Divider } from "antd";
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
  updateUserName,
} from "../../services/firebase";

const { Panel } = Collapse;

const UsersScreen = () => {
  const [users, setUsers] = useState({ enabled: [], disabled: [] });
  const [editUserId, setEditUserId] = useState(null);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const allUsersData = await fetchUsers();
      console.log(allUsersData);
      const allUsers = allUsersData
        ? Object.entries(allUsersData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];

      const enabledUsers = allUsers.filter((user) => user.enabled);
      const disabledUsers = allUsers.filter((user) => !user.enabled);

      setUsers({ enabled: enabledUsers, disabled: disabledUsers });
    };

    loadUsers();
  }, []);

  const handleUpdateUserStatus = async (userId, isEnabled) => {
    await updateUserStatus(userId, isEnabled);

    setUsers((prevUsers) => {
      let { enabled, disabled } = prevUsers;

      if (isEnabled) {
        const user = disabled.find((u) => u.id === userId);
        disabled = disabled.filter((u) => u.id !== userId);
        enabled = [...enabled, { ...user, enabled: true }];
      } else {
        const user = enabled.find((u) => u.id === userId);
        enabled = enabled.filter((u) => u.id !== userId);
        disabled = [...disabled, { ...user, enabled: false }];
      }

      return { enabled, disabled };
    });
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);

    setUsers((prevUsers) => {
      const updatedDisabledUsers = prevUsers.disabled.filter(
        (user) => user.id !== userId
      );

      return {
        ...prevUsers,
        disabled: updatedDisabledUsers,
      };
    });
  };

  const handleEditUser = (userId) => {
    setEditUserId(userId);
    const user = users.enabled.find((u) => u.id === userId);
    setNewUserName(user.name || ""); 
  };

  const handleSaveUserName = async () => {
    if (editUserId && newUserName.trim() !== "") {
      await updateUserName(editUserId, newUserName);
      setEditUserId(null); 
      window.location.reload();
    }
  };

  return (
    <div className="p-8">
      <h1 className="pt-14 text-xl mb-4 text-teal-600">Todos los usuarios:</h1>
      <Collapse defaultActiveKey={[1, 2]} accordion>
        <Panel header="Usuarios Habilitados" key="1">
          <List
            dataSource={users.enabled}
            renderItem={(user, index) => (
              <List.Item key={index}>
                <div className="flex items-center h-full">
                  <p className="bold mr-4 slashed-zero font-bold normal-nums">
                    {user.id}
                  </p>
                  <p className="text-gray-400 ml-4 ">
                    {user.name ?? "Desconocido"}
                  </p>
                </div>
                <div>
                  <Button
                    className="mr-4"
                    onClick={() => handleEditUser(user.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    danger
                    onClick={() => handleUpdateUserStatus(user.id, false)}
                  >
                    Inhabilitar
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Panel>
        <Panel
          header={
            <span>
              Usuarios Inhabilitados
              <Badge count={users.disabled.length} style={{ marginLeft: 10 }} />
            </span>
          }
          key="2"
        >
          <List
            dataSource={users.disabled}
            renderItem={(user, index) => (
              <List.Item key={index}>
                <div className="flex items-center h-full">
                  <p className="bold mr-4 slashed-zero font-bold normal-nums">
                    {user.id}
                  </p>
                  <p className="text-gray-400 ml-4 ">
                    {user.name ?? "Desconocido"}
                  </p>
                </div>
                <div>
                  <Button
                    className="mr-4"
                    onClick={() => handleUpdateUserStatus(user.id, true)}
                  >
                    Habilitar
                  </Button>
                  <Button danger onClick={() => handleDeleteUser(user.id)}>
                    Eliminar
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
      <Modal
        title="Editar Nombre"
        visible={editUserId !== null}
        onOk={handleSaveUserName}
        onCancel={() => setEditUserId(null)}
        okType="default"
      >
        <Input
          placeholder="Nuevo nombre"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default UsersScreen;
