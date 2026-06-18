"use client";

import {
  BookOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  FileDoneOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Progress, Row, Space, Statistic, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/AppShell";

const activityItems = [
  "12 student profiles updated",
  "7 admissions waiting for review",
  "Fee verification report generated",
  "4 course allocations completed",
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <AppShell eyebrow="Overview" title="Dashboard">
      <Space orientation="vertical" size={24} className="dashboard-stack">
        <section className="page-hero">
          <div>
            <Typography.Text className="section-kicker">
              Live college operations
            </Typography.Text>
            <Typography.Title level={1}>
              Keep admissions and records moving.
            </Typography.Title>
            <Typography.Text className="hero-copy">
              Track student records, verification work, and service requests
              from one focused workspace.
            </Typography.Text>
          </div>
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/student/create")}
            >
              Create Student
            </Button>
            <Button icon={<ExportOutlined />} onClick={() => router.push("/students")}>
              View Students
            </Button>
          </Space>
        </section>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-blue">
              <Statistic
                title="Total Students"
                value={1245}
                prefix={<TeamOutlined />}
              />
              <Typography.Text className="metric-note">
                Listed in student records
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-teal">
              <Statistic title="Active Courses" value={18} prefix={<BookOutlined />} />
              <Typography.Text className="metric-note">
                3 new allocations
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-green">
              <Statistic
                title="Verified Records"
                value={92}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
              <Typography.Text className="metric-note">
                104 pending checks
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-amber">
              <Statistic title="Open Requests" value={37} prefix={<FileDoneOutlined />} />
              <Typography.Text className="metric-note">11 due today</Typography.Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={15}>
            <Card
              className="section-card"
              title="Admissions Flow"
              extra={<Tag color="blue">This month</Tag>}
            >
              <Space orientation="vertical" size={20} className="full-width">
                <div>
                  <div className="progress-label">
                    <Typography.Text>Applications reviewed</Typography.Text>
                    <Typography.Text strong>76%</Typography.Text>
                  </div>
                  <Progress percent={76} showInfo={false} />
                </div>
                <div>
                  <div className="progress-label">
                    <Typography.Text>Documents verified</Typography.Text>
                    <Typography.Text strong>68%</Typography.Text>
                  </div>
                  <Progress percent={68} showInfo={false} />
                </div>
                <div>
                  <div className="progress-label">
                    <Typography.Text>Student profiles completed</Typography.Text>
                    <Typography.Text strong>84%</Typography.Text>
                  </div>
                  <Progress percent={84} showInfo={false} />
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={9}>
            <Card className="section-card" title="Recent Updates">
              <Space orientation="vertical" size={14} className="full-width">
                {activityItems.map((item) => (
                  <div className="activity-item" key={item}>
                    <CheckCircleOutlined />
                    <Typography.Text>{item}</Typography.Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </AppShell>
  );
}
