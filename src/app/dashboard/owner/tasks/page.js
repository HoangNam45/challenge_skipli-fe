"use client";

import OwnerLayout from "../../../../components/Owner/OwnerLayout/OwnerLayout";
import ManageTask from "../../../../components/Owner/ManageTask/ManageTask";

const TasksPage = () => {
  return (
    <OwnerLayout selectedKey="tasks" title="Task Management">
      <ManageTask />
    </OwnerLayout>
  );
};

export default TasksPage;
