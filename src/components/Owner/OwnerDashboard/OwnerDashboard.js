"use client";

import OwnerLayout from "../OwnerLayout/OwnerLayout";
import ManageEmployee from "../ManageEmployee/ManageEmployee";

const OwnerDashboard = () => {
  return (
    <OwnerLayout selectedKey="employees" title="Employee Management">
      <ManageEmployee />
    </OwnerLayout>
  );
};

export default OwnerDashboard;
