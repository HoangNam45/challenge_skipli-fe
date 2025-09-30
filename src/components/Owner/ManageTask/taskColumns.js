import { Button, Popconfirm, Tag } from "antd";
import {
  formatFirestoreDate,
  isFirestoreDateOverdue,
} from "../../../utils/dateUtils";

export const getTaskColumns = (handleDeleteTask) => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "Assigned To",
    dataIndex: "assignedEmployee",
    key: "assignedEmployee",
    render: (assignedEmployee) => {
      if (assignedEmployee) {
        return (
          <div>
            <div>{assignedEmployee.name}</div>
            <div className="text-gray-500 text-sm">
              {assignedEmployee.email}
            </div>
          </div>
        );
      }
      return <span className="text-gray-400">Unassigned</span>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusMap = {
        TODO: { text: "To Do" },
        IN_PROGRESS: { text: "In Progress" },
        DONE: { text: "Done" },
      };
      const statusInfo = statusMap[status] || {
        text: status,
      };
      return <Tag>{statusInfo.text}</Tag>;
    },
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: (priority) => {
      const priorityMap = {
        HIGH: { text: "High" },
        MEDIUM: { text: "Medium" },
        LOW: { text: "Low" },
      };
      const priorityInfo = priorityMap[priority] || {
        text: priority,
      };
      return <Tag>{priorityInfo.text}</Tag>;
    },
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (dueDate) => {
      const formattedDate = formatFirestoreDate(dueDate);
      if (formattedDate === "-") {
        return <span className="text-gray-400">No due date</span>;
      }

      // Check if overdue using utility function
      const isOverdue = isFirestoreDateOverdue(dueDate);
      return (
        <span className={isOverdue ? "text-red-500 font-medium" : ""}>
          {formattedDate}
        </span>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Popconfirm
        title="Are you sure you want to delete this task?"
        onConfirm={() => handleDeleteTask(record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link" danger size="small">
          Delete
        </Button>
      </Popconfirm>
    ),
  },
];
