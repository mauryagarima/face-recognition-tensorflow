"use client";

import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Alert, App, Button, Card, Form, Input, Modal, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignInValues = {
  email: string;
  password: string;
};

const SignInPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordForm] = Form.useForm();

  const handleSignin = async (values: SignInValues) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        message.success("Signed in successfully");
        router.push("/dashboard");
        return;
      }

      setError(data.message ?? "Unable to sign in. Please check your details.");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values: { email: string; password: string }) => {
    setForgotPasswordError("");
    setForgotPasswordLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        message.success("Password updated successfully. You can now sign in.");
        setIsForgotPasswordOpen(false);
        forgotPasswordForm.resetFields();
        return;
      }

      setForgotPasswordError(data.message ?? "Unable to reset password. Please try again.");
    } catch {
      setForgotPasswordError("Unable to reach the server. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-shell" aria-label="Sign in">
        <aside className="auth-panel">
          <div className="auth-mark">
            <SafetyCertificateOutlined />
          </div>
          <Space orientation="vertical" size={16}>
            <Typography.Title level={1} className="auth-panel-title">
              ISTS Services
            </Typography.Title>
            <Typography.Text className="auth-panel-copy">
              Secure access for colleges to manage admissions, student records,
              and service requests from one dashboard.
            </Typography.Text>
          </Space>
        </aside>

        <Card className="auth-card" bordered={false}>
          <Space orientation="vertical" size={8} className="auth-heading">
            <Typography.Text className="auth-kicker">Welcome back</Typography.Text>
            <Typography.Title level={2}>Sign in</Typography.Title>
            <Typography.Text type="secondary">
              Continue to your ISTS workspace.
            </Typography.Text>
          </Space>

          {error ? (
            <Alert
              showIcon
              type="error"
              message={error}
              className="auth-alert"
            />
          ) : null}

          <Form
            layout="vertical"
            requiredMark={false}
            onFinish={handleSignin}
            className="auth-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="college@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              block
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              loading={loading}
            >
              Sign in
            </Button>
          </Form>

          <Typography.Paragraph className="auth-switch">
            New college? <Link href="/signup">Create an account</Link>
          </Typography.Paragraph>
          <Typography.Paragraph className="auth-switch">
            <Button type="link" size="small" onClick={() => setIsForgotPasswordOpen(true)}>
              Forgot password?
            </Button>
          </Typography.Paragraph>
        </Card>
      </section>

      <Modal
        title="Reset password"
        open={isForgotPasswordOpen}
        onCancel={() => {
          setIsForgotPasswordOpen(false);
          setForgotPasswordError("");
          forgotPasswordForm.resetFields();
        }}
        footer={null}
      >
        <Form form={forgotPasswordForm} layout="vertical" onFinish={handleForgotPassword}>
          {forgotPasswordError ? (
            <Alert showIcon type="error" message={forgotPasswordError} className="auth-alert" />
          ) : null}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="college@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="New password"
            name="password"
            rules={[{ required: true, message: "New password is required" }]}
          >
            <Input.Password placeholder="Enter new password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" autoComplete="new-password" />
          </Form.Item>

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={() => setIsForgotPasswordOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={forgotPasswordLoading}>
              Reset password
            </Button>
          </Space>
        </Form>
      </Modal>
    </main>
  );
};

export default SignInPage;
