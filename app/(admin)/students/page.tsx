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
  Form,
  Input,
  Modal,
  QRCode,
  Select,
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

type StudentRecord = {
  _id: string;
  name: string;
  enrollmentNumber: string;
  branch: string;
  semester: string;
  introduction?: string;
};

const branchOptions = [
  "Computer Science",
  "Data Science",
  "Mechanical Engineering",
  "Business Administration",
  "Electronics",
  "Civil Engineering",
].map((branch) => ({ label: branch, value: branch }));

const semesterOptions = Array.from({ length: 8 }, (_, index) => {
  const semester = String(index + 1);

  return {
    label: `Semester ${semester}`,
    value: semester,
  };
});

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [hiddenQrCodes, setHiddenQrCodes] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [form] = Form.useForm();
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

  const openEditModal = (student: StudentRecord) => {
    setEditingStudent(student);
    form.setFieldsValue({
      name: student.name,
      enrollmentNumber: student.enrollmentNumber,
      branch: student.branch,
      semester: student.semester,
      introduction: student.introduction || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editingStudent) {
      return;
    }

    try {
      setEditLoading(true);
      const response = await fetch(`/api/students/${editingStudent.enrollmentNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          currentEnrollmentNumber: editingStudent.enrollmentNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update student");
      }

      const apiRes = await fetch("/api/students");
      const data = await apiRes.json();
      setStudents(data);
      setIsEditModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update student");
    } finally {
      setEditLoading(false);
    }
  };

  const columns = useMemo<TableProps<StudentRecord>["columns"]>(
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


            <Button type="primary" onClick={() => openEditModal(record)}>
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
    [form, hiddenQrCodes, router],
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

      <Modal
        title="Edit Student"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={editLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Student name"
            name="name"
            rules={[{ required: true, message: "Student name is required" }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>

          <Form.Item
            label="Enrollment number"
            name="enrollmentNumber"
            rules={[{ required: true, message: "Enrollment number is required" }]}
          >
            <Input placeholder="Enter enrollment number" />
          </Form.Item>

          <Form.Item
            label="Branch"
            name="branch"
            rules={[{ required: true, message: "Branch is required" }]}
          >
            <Select placeholder="Select branch" options={branchOptions} />
          </Form.Item>

          <Form.Item
            label="Semester"
            name="semester"
            rules={[{ required: true, message: "Semester is required" }]}
          >
            <Select placeholder="Select semester" options={semesterOptions} />
          </Form.Item>

          <Form.Item label="Introduction" name="introduction">
            <Input.TextArea placeholder="Enter student introduction" />
          </Form.Item>
        </Form>
      </Modal>
    </AppShell>
  );
}
