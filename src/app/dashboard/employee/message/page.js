"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import EmployeeLayout from "../../../../components/Employee/EmployeeLayout";
import ChatWindow from "../../../../components/Chat/ChatWindow";
import createApiInstance from "../../../../services/apiConfig";
import useChatSocket from "../../../../hooks/useChatSocket";

const EmployeeMessage = () => {
  const { user } = useAuth();
  const [owner, setOwner] = useState(null);
  const socket = useChatSocket(user);
  useEffect(() => {
    if (user?.id) {
      fetchOwnerByEmployeeId(user.id);
    }
  }, [user]);

  const fetchOwnerByEmployeeId = async (employeeId) => {
    try {
      const api = createApiInstance();
      const res = await api.get(`/employee/owner/${employeeId}`);
      if (res.data && res.data.success && res.data.owner) {
        setOwner(res.data.owner);
      } else {
        message.error("Failed to load owner info");
      }
    } catch (e) {
      message.error("Failed to load owner info");
    }
  };

  return (
    <EmployeeLayout
      title="Chat with Owner"
      showBackButton={true}
      currentPage="message"
      hideSidebar={true}
    >
      <ChatWindow otherUser={owner} currentUser={user} socket={socket} />
    </EmployeeLayout>
  );
};

export default EmployeeMessage;
