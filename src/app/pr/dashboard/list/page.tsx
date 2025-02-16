"use client";
import React from "react";
import DashboardLayout from "@/components/Dashboard/Pr/DashboardLayout";
import ListTable from "@/components/Dashboard/Pr/ListTable";

const DashboardListPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full ">
            <ListTable/>
      </div>
    </DashboardLayout>
  );
};

export default DashboardListPage;