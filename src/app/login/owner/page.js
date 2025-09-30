"use client";

import { ConfigProvider } from "antd";
import OwnerAuth from "../../../components/Owner/OwnerAuth/OwnerAuth";

export default function OwnerLoginPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <OwnerAuth />
    </ConfigProvider>
  );
}
