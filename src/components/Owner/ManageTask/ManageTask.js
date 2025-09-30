"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Space,
  Card,
} from "antd";

import dayjs from "dayjs";
import { ownerAPI, taskAPI } from "../../../services";
import { getTaskColumns } from "./taskColumns";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAllTasksByOwner();
      if (response.success) {
        setTasks(response.tasks || []);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await ownerAPI.getAllEmployees();
      setEmployees(response.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddTask = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleDeleteTask = (taskId) => {
    const response = taskAPI.deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    message.success("Task deleted successfully");
  };

  const handleModalSubmit = async (values) => {
    try {
      const taskData = {
        title: values.title,
        description: values.description,
        assignedTo: values.assignedTo,
        priority: values.priority?.toUpperCase() || "MEDIUM",
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
      };
      const response = await taskAPI.createTask(taskData);
      if (response.success) {
        fetchTasks();
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const columns = getTaskColumns(handleDeleteTask);

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={4} className="!m-0">
            Tasks List
          </Title>
          <Button type="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tasks}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `Total ${total} tasks`,
          }}
        />
      </Card>

      <Modal
        title="Add New Task"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          size="large"
          className="pt-4"
          initialValues={{ priority: "medium" }}
        >
          <Form.Item
            label="Task Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter task description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Assign To"
              name="assignedTo"
              rules={[{ required: true, message: "Please select employee" }]}
            >
              <Select placeholder="Select employee" allowClear>
                {employees.map((emp) => (
                  <Option
                    key={emp.id || emp.employeeId || emp.email}
                    value={emp.id || emp.employeeId}
                  >
                    {emp.name} ({emp.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please select due date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select due date"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item className="!mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Create Task
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageTask;
