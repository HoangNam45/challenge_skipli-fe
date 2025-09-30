"use client";

import { ConfigProvider } from "antd";
import OwnerDashboard from "../../../components/Owner/OwnerDashboard/OwnerDashboard";

export default function OwnerDashboardPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <OwnerDashboard />
    </ConfigProvider>
  );
}
