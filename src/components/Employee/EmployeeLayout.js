"use client";

import { useState, useEffect } from "react";
import { Layout, Typography, Button, Form, Input, Space } from "antd";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { employeeAPI } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const EmployeeLayout = ({
  children,
  title = "Employee Dashboard",
  showBackButton = false,
  currentPage = "dashboard",
  hideSidebar = false,
}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard/employee");
  };

  const handleMessageOwner = () => {
    router.push("/dashboard/employee/message");
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const response = await employeeAPI.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (values) => {
    try {
      setLoading(true);
      const response = await employeeAPI.updateProfile(
        values.name,
        values.phone
      );
      if (response.success) {
        setProfile(response.employee);
        form.setFieldsValue(response.employee);
        setEditMode(false);
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          )}
          <Title level={3} className="!m-0">
            {title}
          </Title>
        </div>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.username || user?.email}</span>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Layout>
        {!hideSidebar && (
          <Sider width={350} className="!bg-white h-[100vh] p-6">
            <div className="!p-4">
              {editMode ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleProfileSave}
                  size="small"
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        validator: async (_, value) => {
                          const phone = form.getFieldValue("phone");
                          if (!value && !phone) {
                            throw new Error(
                              "Please provide at least name or phone"
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Enter your name" />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      {
                        validator: async (_, value) => {
                          const name = form.getFieldValue("name");
                          if (!value && !name) {
                            throw new Error(
                              "Please provide at least name or phone"
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Enter your phone" />
                  </Form.Item>
                  <Form.Item label="Role" name="role">
                    <Input placeholder="Enter your role" disabled />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="small"
                        loading={loading}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        size="small"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  <div className="mb-3">
                    <Text strong>Name:</Text>
                    <div>{profile?.name || "Not provided"}</div>
                  </div>
                  <div className="mb-3">
                    <Text strong>Email:</Text>
                    <div>{profile?.email || user?.email}</div>
                  </div>
                  <div className="mb-3">
                    <Text strong>Phone:</Text>
                    <div>{profile?.phone || "Not provided"}</div>
                  </div>
                  <div className="mb-5">
                    <Text strong>Role:</Text>
                    <div>{profile?.role || "Not provided"}</div>
                  </div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {currentPage !== "dashboard" && (
                      <Button
                        type="default"
                        onClick={handleBackToDashboard}
                        block
                      >
                        Back to Tasks
                      </Button>
                    )}
                    {currentPage === "dashboard" && (
                      <Button
                        type="primary"
                        onClick={() => setEditMode(true)}
                        block
                      >
                        Edit Profile
                      </Button>
                    )}
                    <Button
                      onClick={handleMessageOwner}
                      disabled={currentPage === "message"}
                      block
                    >
                      Message With Owner
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          </Sider>
        )}

        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;
