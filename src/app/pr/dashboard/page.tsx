"use client";
import React from "react";
import DashboardLayout from "@/components/Dashboard/Pr/DashboardLayout";
import EventHistory from "@/components/Dashboard/Pr/EventHistory";
import CurrentEventCount from "@/components/Dashboard/Pr/CurrentEventiCount";
import CopyLinkButton from "@/components/Dashboard/Pr/CopyLinkButton";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full md:w-auto">
        <CurrentEventCount />
      </div>
      <div className="w-full md:w-auto mt-6 md:mt-0">
        <EventHistory />
      </div>
      <div className="w-full md:w-auto mt-6 md:mt-0">
        <CopyLinkButton />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
