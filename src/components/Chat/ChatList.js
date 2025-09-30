"use client";

import { useState, useEffect } from "react";
import { Card, List, Avatar, Typography, Empty, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { chatService } from "../../services/chatService";

const { Text } = Typography;

const ChatList = ({ onEmployeeSelect }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await chatService.getAllEmployees();

      if (response.success) {
        setEmployees(response.employees || []);
      } else {
        message.error("Failed to load employees");
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      message.error("Failed to load employees");
    } finally {
    }
  };

  return (
    <Card title="Employees" className="h-full">
      {employees.length === 0 ? (
        <Empty
          description="No employees found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          className="max-h-96 overflow-y-auto"
          dataSource={employees}
          renderItem={(employee) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-50 p-3 rounded"
              onClick={() => onEmployeeSelect(employee)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} src={employee.avatar} />
                }
                title={
                  <div className="font-medium">
                    {employee.name || "Unknown Employee"}
                  </div>
                }
                description={
                  <Text type="secondary" className="text-sm block">
                    {employee.email}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default ChatList;
