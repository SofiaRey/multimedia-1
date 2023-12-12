import React, { useState, useEffect } from "react";
import { Table, Select } from "antd";
import { fetchLogs } from "../../services/firebase";

const { Option } = Select;

const HomeScreen = () => {
  const [logs, setLogs] = useState([]);
  const [order, setOrder] = useState("desc");
  const [sortedLogs, setSortedLogs] = useState([]);

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

  useEffect(() => {
    sortLogs();
  }, [order, logs]);

  const sortLogs = () => {
    const logsCopy = [...logs];
    if (order === "asc") {
      logsCopy.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } else {
      logsCopy.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    setSortedLogs(logsCopy);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
  };

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
      title: "ID del Usuario",
      dataIndex: "id",
      key: "id",
    },
    // Puedes agregar más columnas si necesitas
  ];

  const formattedLogs = sortedLogs.map((log, index) => {
    return {
      key: index,
      id: log.user,
      date: new Date(log.timestamp).toLocaleDateString(),
      time: new Date(log.timestamp).toLocaleTimeString(),
    };
  });


  return (
    <div className="p-8">
      <div className="flex pt-14 justify-between ">
        <h1 className="text-xl mb-4 text-teal-600">Últimos logs:</h1>
        <div>
          <Select defaultValue={order} onChange={handleOrderChange}>
            <Option value="asc">Ascendente</Option>
            <Option value="desc">Descendente</Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={formattedLogs} />
    </div>
  );
};

export default HomeScreen;
