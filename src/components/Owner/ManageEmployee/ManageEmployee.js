"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Space,
  Card,
} from "antd";
import { ownerAPI } from "../../../services";
import { getEmployeeColumns } from "./employeeColumns";

const { Title } = Typography;

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.getAllEmployees();
      setEmployees(response.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setModalVisible(true);
    form.setFieldsValue(employee);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await ownerAPI.deleteEmployee(employeeId);
      if (response.success) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingEmployee) {
        const updateData = {
          employeeId: editingEmployee.id || editingEmployee.employeeId,
          ...values,
        };
        const response = await ownerAPI.updateEmployee(updateData);
        if (response.success) {
          setModalVisible(false);
          form.resetFields();
          fetchEmployees();
        }
      } else {
        const response = await ownerAPI.createEmployee(values);
        if (response.success) {
          setModalVisible(false);
          form.resetFields();
          fetchEmployees();
        }
      }
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const columns = getEmployeeColumns(handleEditEmployee, handleDeleteEmployee);
  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={4} className="!m-0">
            Employees List
          </Title>
          <Button type="primary" onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey={(record) => record.id || record.employeeId || record.email}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} employees`,
          }}
        />
      </Card>

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          size="large"
          className="pt-4"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter employee name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          {!editingEmployee && (
            <>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please enter role" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          {editingEmployee && (
            <>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    min: 3,
                    message: "Username must be at least 3 characters",
                  },
                  {
                    max: 20,
                    message: "Username must not exceed 20 characters",
                  },
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please enter role" }]}
              >
                <Input placeholder="Enter role" />
              </Form.Item>
            </>
          )}

          <Form.Item className="!mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingEmployee ? "Update" : "Create"} Employee
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageEmployee;
