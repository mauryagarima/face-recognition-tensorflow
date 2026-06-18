"use client";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FieldNumberOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../../components/AppShell";

type Student = {
  _id: string;
  name: string;
  enrollmentNumber: number;
  branch: string;
  semester: number;
};

type AttendanceRecord = {
  _id: string;
  studentId: string;
  date: string;
  timestamp?: string;
};

function formatDateTime(value?: string) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function StudentDetailPage() {
  const params = useParams<{ enrollmentNumber: string }>();
  const router = useRouter();
  const enrollmentNumber = params.enrollmentNumber;
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const attendancePercent = useMemo(() => {
    if (!attendance.length) {
      return 0;
    }

    return 100;
  }, [attendance.length]);

  useEffect(() => {
    let isActive = true;

    const loadStudentDetails = async () => {
      await Promise.resolve();

      if (!isActive) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const studentRes = await fetch(`/api/students/${enrollmentNumber}`);
        const studentData = await studentRes.json();

        if (!studentRes.ok) {
          throw new Error(studentData.message || "Student not found");
        }

        if (!isActive) {
          return;
        }

        setStudent(studentData);
        setAttendanceLoading(true);

        const attendanceRes = await fetch(`/api/attendence?studentId=${studentData._id}`);
        const attendanceData = await attendanceRes.json();

        if (!attendanceRes.ok) {
          throw new Error(attendanceData.message || "Failed to fetch attendance");
        }

        if (isActive) {
          setAttendance(attendanceData);
        }
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch student details. Please try again later.",
        );
        setAttendance([]);
        setStudent(null);
      } finally {
        if (isActive) {
          setAttendanceLoading(false);
          setLoading(false);
        }
      }
    };

    void loadStudentDetails();

    return () => {
      isActive = false;
    };
  }, [enrollmentNumber]);

  const columns = useMemo<TableProps<AttendanceRecord>["columns"]>(
    () => [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 220,
        render: (date: string) => (
          <Space size={10}>
            <CalendarOutlined />
            <Typography.Text strong>{date}</Typography.Text>
          </Space>
        ),
      },
      {
        title: "Marked Time",
        dataIndex: "timestamp",
        key: "timestamp",
        width: 260,
        render: (timestamp: string) => formatDateTime(timestamp),
      },
      {
        title: "Status",
        key: "status",
        width: 150,
        render: () => (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Present
          </Tag>
        ),
      },
    ],
    [],
  );

  return (
    <AppShell
      eyebrow="Student Management"
      title="Student Details"
      actions={
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/students")}>
          Back to Students
        </Button>
      }
    >
      <Space orientation="vertical" size={24} className="dashboard-stack">
        <section className="page-hero page-hero-compact">
          <Space size={18} align="start" className="student-detail-heading">
            <Avatar size={64} className="student-avatar" icon={<UserOutlined />} />
            <div>
              <Typography.Text className="section-kicker">Student Profile</Typography.Text>
              <Typography.Title level={1}>
                {student?.name || "Student details"}
              </Typography.Title>
              <Typography.Text className="hero-copy">
                Enrollment {enrollmentNumber} attendance history and academic record.
              </Typography.Text>
            </div>
          </Space>
          <Space wrap>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/students")}>
              Back
            </Button>
          </Space>
        </section>

        {error ? <Alert showIcon type="warning" message={error} /> : null}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card className="student-summary-card metric-blue" loading={loading}>
              <Statistic
                title="Enrollment No."
                value={student?.enrollmentNumber || enrollmentNumber}
                prefix={<FieldNumberOutlined />}
              />
              <Typography.Text className="metric-note">Registered student ID</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="student-summary-card metric-teal" loading={loading}>
              <Statistic title="Branch" value={student?.branch || "-"} prefix={<TeamOutlined />} />
              <Typography.Text className="metric-note">Academic department</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="student-summary-card metric-green" loading={loading}>
              <Statistic
                title="Semester"
                value={student?.semester || "-"}
                prefix={<ReadOutlined />}
              />
              <Typography.Text className="metric-note">Current semester</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="student-summary-card metric-amber" loading={loading}>
              <Statistic
                title="Attendance Entries"
                value={attendance.length}
                prefix={<ClockCircleOutlined />}
                suffix={attendancePercent ? "marked" : ""}
              />
              <Typography.Text className="metric-note">Total present records</Typography.Text>
            </Card>
          </Col>
        </Row>

        <Card
          className="section-card data-card"
          title="Attendance List"
          extra={<Tag color="blue">{attendance.length} records</Tag>}
        >
          <Table
            columns={columns}
            dataSource={attendance}
            loading={loading || attendanceLoading}
            locale={{ emptyText: <Empty description="No attendance records found" /> }}
            pagination={{ pageSize: 8 }}
            rowKey="_id"
            scroll={{ x: 680 }}
            className="students-table"
          />
        </Card>
      </Space>
    </AppShell>
  );
}
