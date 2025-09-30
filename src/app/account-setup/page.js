"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfigProvider } from "antd";
import { employeeAPI } from "../../services";

const { Title, Text } = Typography;

export default function AccountSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else {
      message.error("Invalid setup link. No token provided.");
    }
  }, [searchParams, router]);

  const verifyToken = async (token) => {
    setVerifying(true);
    try {
      const response = await employeeAPI.verifyToken(token);

      if (response.valid) {
        setEmployee(response.employee);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    } finally {
      setVerifying(false);
    }
  };

  const handleAccountSetup = async (values) => {
    setLoading(true);
    try {
      const response = await employeeAPI.accountSetup(
        token,
        values.username,
        values.password
      );

      if (response.success) {
        setCurrentStep(2);
        setTimeout(() => {
          router.push("/login/employee");
        }, 1000);
      }
    } catch (error) {
      console.error("Error setting up account:", error);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#52c41a",
          },
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f2f5",
          }}
        >
          <Card style={{ width: 400, padding: "40px", textAlign: "center" }}>
            <Spin size="large" />
            <div style={{ marginTop: "20px" }}>
              <Text>Verifying your setup link</Text>
            </div>
          </Card>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#52c41a",
        },
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card style={{ width: 500, padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title level={2}>Account Setup</Title>
          </div>

          {currentStep === 1 && employee && (
            <div>
              <Form
                name="account-setup-form"
                onFinish={handleAccountSetup}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username!" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters!",
                    },
                    {
                      max: 20,
                      message: "Username must be less than 20 characters!",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores!",
                    },
                  ]}
                >
                  <Input placeholder="Choose a username" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Create a password" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    Complete Setup
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ color: "#52c41a" }}>
                Account Setup Complete
              </Title>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}
