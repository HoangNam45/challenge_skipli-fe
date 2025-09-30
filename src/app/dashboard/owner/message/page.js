"use client";

import { Row, Col } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import ChatList from "../../../../components/Chat/ChatList";
import OwnerLayout from "../../../../components/Owner/OwnerLayout/OwnerLayout";
import useChatSocket from "../../../../hooks/useChatSocket";

const OwnerMessagePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const socket = useChatSocket(user);

  const handleEmployeeSelect = (employee) => {
    router.push(`/dashboard/owner/message/${employee.id}`);
  };

  return (
    <OwnerLayout selectedKey="messages" title="Messages">
      <div className="h-full" style={{ height: "calc(100vh - 140px)" }}>
        <Row gutter={16} className="h-full">
          <Col xs={24} className="h-full">
            <ChatList onEmployeeSelect={handleEmployeeSelect} />
          </Col>
        </Row>
      </div>
    </OwnerLayout>
  );
};

export default OwnerMessagePage;
