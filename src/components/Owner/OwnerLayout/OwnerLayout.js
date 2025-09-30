"use client";
import { Layout, Menu, Typography, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const OwnerLayout = ({
  children,
  selectedKey = "employees",
  title = "Owner Dashboard",
}) => {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "employees":
        router.push("/dashboard/owner");
        break;
      case "tasks":
        router.push("/dashboard/owner/tasks");
        break;
      case "messages":
        router.push("/dashboard/owner/message");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "employees",

      label: "Manage Employee",
    },
    {
      key: "tasks",
      label: "Manage Task",
    },
    {
      key: "messages",
      label: "Message",
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <Title level={3} className="!m-0">
            {title}
          </Title>
        </div>
        <div className="flex items-center gap-4">
          <span>Welcome, Owner ({user?.phoneNumber})</span>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Layout>
        <Sider width={250} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems}
            className="h-full border-r-0"
            style={{ paddingTop: "16px" }}
          />
        </Sider>

        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default OwnerLayout;
