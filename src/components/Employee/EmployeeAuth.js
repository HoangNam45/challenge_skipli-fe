"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";

import { employeeAPI } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const EmployeeLoginNew = () => {
  const [loading, setLoading] = useState(false);
  const { loginEmployee } = useAuth();
  const router = useRouter();

  const handleUsernameLogin = async (values) => {
    setLoading(true);
    try {
      const response = await employeeAPI.login(
        values.username,
        values.password
      );
      if (response.success) {
        loginEmployee(response.authToken);
        message.success("Login successful");
        router.push("/dashboard/employee");
      } else {
        message.error("Invalid username or password.");
      }
    } catch (error) {
      message.error(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[450px] p-5">
        <div className="text-center mb-8">
          <Title level={2}>Employee Login</Title>
        </div>
        <Form
          name="username-login-form"
          onFinish={handleUsernameLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-green-500 !border-green-500 hover:!bg-green-600 hover:!border-green-600"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeLoginNew;
