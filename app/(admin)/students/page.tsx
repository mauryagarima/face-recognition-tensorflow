"use client";
import {
  EyeOutlined,
  UserOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  QRCode,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell";

const QR_CODE_PREFIX = "student:";



export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Array<{
    _id: string,
    name: string;
    enrollmentNumber: number,
    branch: string;
    semester: number
  }>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hiddenQrCodes, setHiddenQrCodes] = useState<string[]>([]);
  useEffect(() => {
    let isActive = true;

    const loadStudents = async () => {
      await Promise.resolve();

      if (!isActive) {
        return;
      }

      setLoading(true)
      try {
        const apiRes = await fetch("/api/students")
        const data = await apiRes.json()

        if (isActive) {
          setStudents(data)
        }
      } catch {
        if (isActive) {
          setError("Failed to fetch student records. Please try again later.");
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    };

    void loadStudents();

    return () => {
      isActive = false;
    };
  }, [])

  const deleteStudent = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/students/id/${id}`, {
        method: "DELETE",
      });
      const apiRes = await fetch("/api/students")
      const data = await apiRes.json()
      setStudents(data)
      setDeleteLoading(false);
    } catch {
      alert("Failed to delete student");
    }
  };

  const removeQrCode = (id: string) => {
    setHiddenQrCodes((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  const columns = useMemo<TableProps["columns"]>(
    () => [
      {
        title: "Enrollment No.",
        dataIndex: "enrollmentNumber",
        key: "enrollmentNumber",
        width: 190,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 260,
        render: (name: string) => (
          <Space size={12}>
            <Avatar className="student-avatar" icon={<UserOutlined />} />
            <Typography.Text strong>{name}</Typography.Text>
          </Space>
        ),
      },

      {
        title: "Branch",
        dataIndex: "branch",
        key: "branch",
        width: 240,
      },
      {
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
        width: 130,
        render: (semester: string) => <Tag color="geekblue">Semester {semester}</Tag>,
      },
      {
        title: "QR Code",
        key: "qrCode",
        width: 180,
        render: (_value, record) => {
          if (hiddenQrCodes.includes(record._id)) {
            return <Tag color="default">QR removed</Tag>;
          }

          return (
            <Space direction="vertical" size={4} align="center">
              <QRCode
                value={`${QR_CODE_PREFIX}${record.enrollmentNumber}`}
                size={72}
                errorLevel="H"
              />
              <Button
                size="small"
                danger
                onClick={(event) => {
                  event.stopPropagation();
                  removeQrCode(record._id);
                }}
              >
                Delete
              </Button>
            </Space>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        width: 300,
        render: (_item, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/students/${record.enrollmentNumber}`)
              }
            >
              View
            </Button>


            <Button
              type="primary"
              onClick={() =>
                router.push(`/students/${record.enrollmentNumber}`)
              }
            >
              Edit
            </Button>



            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteStudent(record._id)}
            >
              Delete
            </Button>
          </Space >
        ),
      }



    ],
    [hiddenQrCodes, router],
  );

  return (
    <AppShell
      eyebrow="Student Management"
      title="Students"
      actions={
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => router.push("/student/create")}
        >
          Create Student
        </Button>
      }
    >
      <Space orientation="vertical" size={24} className="dashboard-stack">
        <section className="page-hero page-hero-compact">
          <div>
            <Typography.Text className="section-kicker">Student List</Typography.Text>
            <Typography.Title level={1}>Students</Typography.Title>
            <Typography.Text className="hero-copy">
              View enrollment details, academic branch, semester, and current
              completion progress.
            </Typography.Text>
          </div>
          <Space wrap>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => router.push("/student/create")}
            >
              Create Student
            </Button>

          </Space>
        </section>

        {error ? <Alert showIcon type="warning" message={error} /> : null}

        <Card
          className="section-card data-card"
          title="Student Records"
          extra={<Tag color="blue">{students.length} students</Tag>}
        >
          <Table
            columns={columns}
            dataSource={students}
            loading={loading || deleteLoading}
            pagination={{ pageSize: 8 }}
            rowKey="_id"
            scroll={{ x: 1060 }}
            className="students-table"
          />
        </Card>
      </Space>
    </AppShell>
  );
}
