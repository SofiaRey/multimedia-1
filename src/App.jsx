import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from "./components/Home/HomeScreen";
import UsersScreen from "./components/Users/UsersScreen";
import Navbar from "./components/Navbar";
import { ConfigProvider } from "antd";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#14b8a6",
        },
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/usuarios" element={<UsersScreen />} />
          
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
