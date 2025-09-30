"use client";

import { useState, useEffect } from "react";
import { Card, Tag, List, Empty, Select, Space, Typography } from "antd";
import { taskAPI } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import {
  formatFirestoreDate,
  isFirestoreDateOverdue,
} from "../../utils/dateUtils";
import EmployeeLayout from "./EmployeeLayout";

const { Text } = Typography;

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await taskAPI.getTasksByEmployee(user.id);
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
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "DONE":
        return "Done";
      case "IN_PROGRESS":
        return "In Progress";
      case "TODO":
        return "To Do";
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return priority;
    }
  };

  return (
    <EmployeeLayout title="Employee Dashboard" currentPage="dashboard">
      <Card title="My Tasks" loading={loading}>
        {tasks.length === 0 ? (
          <Empty description="No tasks assigned yet" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={tasks}
            renderItem={(task) => {
              const isOverdue = isFirestoreDateOverdue(task.dueDate);
              const formattedDueDate = formatFirestoreDate(task.dueDate);

              return (
                <List.Item
                  key={task.id}
                  actions={[
                    <Select
                      value={task.status}
                      onChange={(newStatus) =>
                        handleStatusChange(task.id, newStatus)
                      }
                      size="small"
                      style={{ width: 120 }}
                      options={[
                        {
                          value: "TODO",
                          label: "To Do",
                          disabled: task.status === "TODO",
                        },
                        {
                          value: "IN_PROGRESS",
                          label: "In Progress",
                          disabled: task.status === "IN_PROGRESS",
                        },
                        {
                          value: "DONE",
                          label: "Done",
                          disabled: task.status === "DONE",
                        },
                      ]}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center gap-2">
                        <span>{task.title}</span>
                        <Tag>{getStatusText(task.status)}</Tag>
                        <Tag>{getPriorityText(task.priority)}</Tag>
                        {isOverdue && <Tag color="red">Overdue</Tag>}
                      </div>
                    }
                    description={
                      <div>
                        {task.description && <p>{task.description}</p>}
                        <Space>
                          <Text type={isOverdue ? "danger" : "secondary"}>
                            Due:{" "}
                            {formattedDueDate !== "-"
                              ? formattedDueDate
                              : "No due date"}
                          </Text>
                        </Space>
                        <div className="mt-2">
                          <Text type="secondary" className="text-sm">
                            Created: {formatFirestoreDate(task.createdAt)}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
