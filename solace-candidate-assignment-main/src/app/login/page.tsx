"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import {
  Card,
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Divider,
  Space,
  Spin
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  const { login, loading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setMessage("");

    const result = await login(values.username, values.password);

    if (result.success) {
      setMessage("Login successful!");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setMessage(result.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px'
      }}>
        <Card style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Alert
                message="Already logged in. Redirecting..."
                type="success"
                showIcon
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '24px',
      backgroundColor: '#f5f5f5'
    }}>
      <Card
        style={{
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Login
          </Title>
        </div>

        {message && (
          <Alert
            message={message}
            type={user ? "success" : "error"}
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {user && (
          <Card
            size="small"
            style={{
              marginBottom: '24px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b8daff'
            }}
          >
            <Title level={4} style={{ marginBottom: '12px' }}>
              Welcome, {user.username}!
            </Title>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text><strong>Role:</strong> {user.role}</Text>
              <Text><strong>Login Count:</strong> {user.numberOfLogins}</Text>
              <Text><strong>Account Created:</strong> {new Date(user.dateCreated).toLocaleDateString()}</Text>
              <Text><strong>Last Updated:</strong> {new Date(user.dateUpdated).toLocaleDateString()}</Text>
            </Space>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          disabled={loading}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Card
          size="small"
          title="Demo Database Credentials"
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef'
          }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text><strong>Username:</strong> admin_user, <strong>Password:</strong> pw1234</Text>
            <Text><strong>Username:</strong> regular_user, <strong>Password:</strong> pw1234</Text>
            <Text><strong>Username:</strong> advocate_user, <strong>Password:</strong> pw1234</Text>
            <Text><strong>Username:</strong> James, <strong>Password:</strong> pw1234 </Text>
            <Text style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>*Use James for testing the ADVOCATE role</Text>
          </Space>
        </Card>
      </Card>
    </div>
  );
} 