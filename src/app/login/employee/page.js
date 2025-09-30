"use client";

import { ConfigProvider } from "antd";
import EmployeeAuth from "../../../components/Employee/EmployeeAuth";

export default function EmployeeLoginPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#52c41a",
        },
      }}
    >
      <EmployeeAuth />
    </ConfigProvider>
  );
}
