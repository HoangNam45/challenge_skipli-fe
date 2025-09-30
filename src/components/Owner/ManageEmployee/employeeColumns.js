import { Button, Space, Tag, Popconfirm } from "antd";

export const getEmployeeColumns = (
  handleEditEmployee,
  handleDeleteEmployee
) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (text) => (
      <code className="bg-gray-100 px-2 py-1 rounded">{text}</code>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text) => {
      return <Tag>{text}</Tag>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag>{status || "Pending"}</Tag>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          onClick={() => handleEditEmployee(record)}
          size="small"
        >
          Edit
        </Button>
        <Popconfirm
          title="Are you sure you want to delete this employee?"
          onConfirm={() => handleDeleteEmployee(record.id || record.employeeId)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger size="small">
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];
