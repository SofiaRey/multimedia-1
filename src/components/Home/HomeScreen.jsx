import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { fetchLogs, database } from "../../services/firebase";

const HomeScreen = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const fetchedLogs = await fetchLogs();
      const logsArray = fetchedLogs
        ? Object.entries(fetchedLogs).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];
      setLogs(logsArray);
    };

    loadLogs();
  }, []);

  // Define las columnas para la tabla de Ant Design
  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Hora",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "User Card ID",
      dataIndex: "id",
      key: "id",
    },
    // Puedes agregar más columnas si necesitas
  ];

  // Prepara los datos para la tabla
  const data = logs.map((log, index) => {
    return {
      key: index,
      id: log.user,
      date: new Date(log.timestamp).toLocaleDateString(),
      time: new Date(log.timestamp).toLocaleTimeString(),
    };
  });

  return (
    <div className="p-8">
      <h1 className="pt-14 text-xl mb-4 text-teal-600">Últimos logs:</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default HomeScreen;
