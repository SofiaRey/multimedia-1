import React, { useState, useEffect } from "react";
import { Collapse, Badge, Button, List } from "antd";
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
} from "../../services/firebase";

const { Panel } = Collapse;

const UsersScreen = () => {
  const [users, setUsers] = useState({ enabled: [], disabled: [] });

  useEffect(() => {
    const loadUsers = async () => {
      const allUsersData = await fetchUsers();
      console.log(allUsersData);
      // Transforma el objeto de usuarios en un arreglo si es necesario
      const allUsers = allUsersData
        ? Object.entries(allUsersData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];

      // Filtra los usuarios habilitados e inhabilitados
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
        // Mover el usuario de disabled a enabled
        const user = disabled.find((u) => u.id === userId);
        disabled = disabled.filter((u) => u.id !== userId);
        enabled = [...enabled, { ...user, enabled: true }];
      } else {
        // Mover el usuario de enabled a disabled
        const user = enabled.find((u) => u.id === userId);
        enabled = enabled.filter((u) => u.id !== userId);
        disabled = [...disabled, { ...user, enabled: false }];
      }

      return { enabled, disabled };
    });
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);

    // Actualizar el estado para reflejar la eliminación
    setUsers((prevUsers) => {
      // Filtrar el usuario eliminado de la lista de usuarios inhabilitados
      const updatedDisabledUsers = prevUsers.disabled.filter(
        (user) => user.id !== userId
      );

      // Devolver el nuevo estado con el usuario eliminado
      return {
        ...prevUsers,
        disabled: updatedDisabledUsers,
      };
    });
  };

  return (
    <div className="pt-20 p-8">
      <Collapse defaultActiveKey={[1, 2]} accordion>
        <Panel header="Usuarios Habilitados" key="1">
          <List
            dataSource={users.enabled}
            renderItem={(user, index) => (
              <List.Item key={index}>
                <p>{user.id}</p>
                <Button onClick={() => handleUpdateUserStatus(user.id, false)}>
                  Inhabilitar
                </Button>
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
                <p>{user.id}</p>
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
    </div>
  );
};

export default UsersScreen;
