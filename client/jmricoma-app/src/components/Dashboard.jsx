import React from 'react';
import { DashboardProvider } from './DashboardContext';
import Aside from './LayoutDashboard/Aside';
import MainContent from './LayoutDashboard/MainContent';
import '../Dashboard.css';


function Dashboard() {
  return (
    <DashboardProvider>
        <div className="flex min-h-screen">
            <Aside />
            <MainContent />
        </div>
    </DashboardProvider>
  );
}

export default Dashboard;