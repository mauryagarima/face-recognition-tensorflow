"use client";

import {
  BookOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  FileDoneOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Progress, Row, Skeleton, Space, Statistic, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import AttendanceGraph from "@/app/components/AttendanceGraph";
import { useEffect, useState } from "react";

const activityItems = [
  "12 student profiles updated",
  "7 admissions waiting for review",
  "Fee verification report generated",
  "4 course allocations completed",
];

export default function DashboardPage() {
  const router = useRouter();
  const [studentCount, setStudentCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const getStudentCounts = async () => {
    try {
      setLoading(true)
      const apiRes = await fetch("/api/students/count")
      const apiJson = await apiRes.json()
      setStudentCount(apiJson.count)
      setLoading(false)

    } catch (error) {
      setLoading(false)

    }
  }

  useEffect(() => {
    getStudentCounts()
  }, [])

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
          <Col
            xs={24} sm={24} xl={24}
          >
            {loading ? <Skeleton active={loading} /> :
              <Card className="metric-card metric-blue">
                <Statistic
                  title="Total Students"
                  value={studentCount}
                  prefix={<TeamOutlined />}
                />
                <Typography.Text className="metric-note">
                  Listed in student records
                </Typography.Text>
              </Card>}
          </Col>
          {/* <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-teal">
              <Statistic title="Active Courses" value={18} prefix={<BookOutlined />} />
              <Typography.Text className="metric-note">
                3 new allocations
              </Typography.Text>
            </Card>
          </Col> */}
          {/* <Col xs={24} sm={12} xl={6}>
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
          </Col> */}
          {/* <Col xs={24} sm={12} xl={6}>
            <Card className="metric-card metric-amber">
              <Statistic title="Open Requests" value={37} prefix={<FileDoneOutlined />} />
              <Typography.Text className="metric-note">11 due today</Typography.Text>
            </Card>
          </Col> */}
        </Row>

        <Row>
          <Card style={{ width: "100%" }}>
            <AttendanceGraph />
          </Card>
        </Row>


      </Space>
    </AppShell>
  );
}
