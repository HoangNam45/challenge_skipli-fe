"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";

import { ownerAPI } from "../../../services";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const OwnerAuth = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessCode, setAccessCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginOwner } = useAuth();
  const router = useRouter();

  const handlePhoneSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await ownerAPI.createAccessCode(values.phoneNumber);
      setAccessCode(response.data);
      setPhoneNumber(values.phoneNumber);
      setCurrentStep(1);
    } catch (error) {
      message.error("Failed to send access code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async (values) => {
    setLoading(true);
    try {
      const response = await ownerAPI.validateAccessCode(
        phoneNumber,
        values.accessCode
      );
      if (response.success) {
        loginOwner(response.authToken);
        message.success("Login successful!");
        router.push("/dashboard/owner");
      } else {
        message.error("Invalid access code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying access code:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setPhoneNumber("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] p-5">
        <div className="text-center mb-8">
          <Title level={2}>Owner Login</Title>
        </div>

        {currentStep === 0 && (
          <Form
            name="phone-form"
            onFinish={handlePhoneSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter your phone number!" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Please enter a valid phone number!",
                },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Send Access Code
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <Form
            name="code-form"
            onFinish={handleCodeVerification}
            layout="vertical"
            size="large"
          >
            <Form.Item>
              <Text>
                Access code sent to: <strong>{phoneNumber}</strong>
              </Text>
            </Form.Item>

            {accessCode && (
              <Form.Item>
                <div className="bg-white border border-gray-300 rounded-md p-3 mb-4 text-sm leading-relaxed">
                  <Text type="secondary">
                    Since Twilio trial version only sends SMS to pre-verified
                    phone numbers, using this access code to continue:{" "}
                    <strong>{accessCode}</strong>
                  </Text>
                </div>
              </Form.Item>
            )}

            <Form.Item
              label="Access Code"
              name="accessCode"
              rules={[
                { required: true, message: "Please enter the access code" },
                { len: 6, message: "Access code must be 6 digits!" },
              ]}
            >
              <Input placeholder="Enter 6-digit access code" maxLength={6} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Verify Code
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" onClick={resetForm} block>
                Change phone number
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default OwnerAuth;
