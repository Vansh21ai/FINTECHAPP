import React from 'react';
import HeaderBar from './HeaderBar';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import LeftPanel from './LeftPanel';
import FloatingWidget from './FloatingWidget';
import AiInsightsFeed from './AiInsightsFeed';

const Dashboard = ({ onSignOut }) => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto relative z-10 w-full flex flex-col gap-6 pb-24">
      {/* Top Header Row = 12 cols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        <HeaderBar onSignOut={onSignOut} />
      </div>

      {/* Main Bento Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full auto-rows-min flex-1">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
        
        {/* Foundation Element spanning all columns */}
        <AiInsightsFeed />
      </div>

      <FloatingWidget />
    </div>
  );
};

export default Dashboard;
