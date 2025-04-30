"use client";

import React from "react";
import DashboardLayout from "@/components/Dashboard/Pr/DashboardLayout";
import EventHistory from "@/components/Dashboard/Pr/EventHistory";

const StoricoPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Storico Eventi</h2>
        <EventHistory />
      </div>
    </DashboardLayout>
  );
};

export default StoricoPage;
