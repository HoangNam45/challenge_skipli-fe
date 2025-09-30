"use client";

import { ConfigProvider } from "antd";
import EmployeeDashboard from "../../../components/Employee/EmployeeDashboard";

export default function EmployeeDashboardPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#52c41a",
        },
      }}
    >
      <EmployeeDashboard />
    </ConfigProvider>
  );
}
