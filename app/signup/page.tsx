"use client";

import {
  BankOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Alert, App, Button, Card, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  petName: string;
  firstSchoolName: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: SignUpValues) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        message.success(data.message ?? "Account created successfully");
        router.replace("/signin");
        return;
      }

      setError(data.message ?? "Unable to create account. Please try again.");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-shell auth-shell-reverse" aria-label="Sign up">
        <Card className="auth-card" bordered={false}>
          <Space orientation="vertical" size={8} className="auth-heading">
            <Typography.Text className="auth-kicker">
              College onboarding
            </Typography.Text>
            <Typography.Title level={2}>Create account</Typography.Title>
            <Typography.Text type="secondary">
              Set up your ISTS workspace.
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
            onFinish={handleSignup}
            className="auth-form"
          >
            <Form.Item
              label="College name"
              name="name"
              rules={[{ required: true, message: "College name is required" }]}
            >
              <Input
                prefix={<BankOutlined />}
                placeholder="Enter college name"
                autoComplete="organization"
              />
            </Form.Item>

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
              label="Pet name"
              name="petName"
              rules={[{ required: true, message: "Pet name is required" }]}
            >
              <Input placeholder="Enter your pet name" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="First school name"
              name="firstSchoolName"
              rules={[{ required: true, message: "First school name is required" }]}
            >
              <Input placeholder="Enter your first school name" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Button
              block
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              loading={loading}
            >
              Create account
            </Button>
          </Form>

          <Typography.Paragraph className="auth-switch">
            Already registered? <Link href="/signin">Sign in</Link>
          </Typography.Paragraph>
        </Card>

        <aside className="auth-panel">
          <div className="auth-mark">
            <UserAddOutlined />
          </div>
          <Space orientation="vertical" size={16}>
            <Typography.Title level={1} className="auth-panel-title">
              Start with ISTS
            </Typography.Title>
            <Typography.Text className="auth-panel-copy">
              Register your college and keep student operations organized with
              a clean, reliable dashboard.
            </Typography.Text>
          </Space>
        </aside>
      </section>
    </main>
  );
};

export default SignUpPage;
