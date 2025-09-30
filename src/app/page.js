"use client";

import { Button, Typography } from "antd";
import { ConfigProvider } from "antd";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title } = Typography;

export default function Home() {
  const { isAuthenticated, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (userType === "owner") {
        router.push("/dashboard/owner");
      } else if (userType === "employee") {
        router.push("/dashboard/employee");
      }
    }
  }, [isAuthenticated, userType, router]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <div className="text-center max-w-lg">
          <Title level={1} className="!text-blue-500 !mb-2">
            Task Management System
          </Title>

          <div className="flex flex-col gap-4">
            <Link href="/login/owner">
              <Button
                type="primary"
                size="large"
                block
                className="!h-[60px] !text-lg !bg-blue-500 !border-blue-500 hover:!bg-blue-600 hover:!border-blue-600"
              >
                Login as Owner
              </Button>
            </Link>

            <Link href="/login/employee">
              <Button
                type="primary"
                size="large"
                block
                className="!h-[60px] !text-lg !bg-green-500 !border-green-500 hover:!bg-green-600 hover:!border-green-600"
              >
                Login as Employee
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
