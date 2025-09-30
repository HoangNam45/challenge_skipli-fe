"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { message, Button } from "antd";
import { useAuth } from "../../../../../contexts/AuthContext";
import ChatWindow from "../../../../../components/Chat/ChatWindow";
import OwnerLayout from "../../../../../components/Owner/OwnerLayout/OwnerLayout";
import { chatService } from "@/services";
import useChatSocket from "../../../../../hooks/useChatSocket";

const OwnerEmployeeChatPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId;

  const [otherUser, setOtherUser] = useState(null);
  const socket = useChatSocket(user);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeesResponse = await chatService.getAllEmployees();
        if (employeesResponse.success) {
          const employee = employeesResponse.employees.find(
            (emp) => emp.id === employeeId
          );
          if (employee) {
            setOtherUser(employee);
          } else {
            message.error("Employee not found");
            router.push("/dashboard/owner/message");
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load employee info:", error);
      }
    };
    if (user && employeeId) {
      fetchEmployee();
    }
  }, [user, employeeId]);

  const handleBack = () => {
    router.push("/dashboard/owner/message");
  };

  return (
    <OwnerLayout selectedKey="messages" title="Messages">
      <div className="h-full" style={{ height: "calc(100vh - 140px)" }}>
        <div className="mb-4">
          <Button onClick={handleBack} type="text">
            Back to Employee List
          </Button>
        </div>

        <div className="h-full">
          {otherUser ? (
            <ChatWindow
              otherUser={otherUser}
              currentUser={user}
              socket={socket}
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerEmployeeChatPage;
