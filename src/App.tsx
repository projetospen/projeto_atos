/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChurchProvider, useChurch } from './context/ChurchContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { MembersView } from './components/members/MembersView';
import { DepartmentsView } from './components/departments/DepartmentsView';
import { CalendarView } from './components/calendar/CalendarView';
import { SchedulesView } from './components/schedules/SchedulesView';
import { FinancesView } from './components/finances/FinancesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { MemberCardModal } from './components/common/MemberCardModal';
import { MemberFormModal } from './components/members/MemberFormModal';
import { EventFormModal } from './components/calendar/EventFormModal';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedMemberForCard, 
    setSelectedMemberForCard, 
    churchProfile 
  } = useChurch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickMemberModalOpen, setIsQuickMemberModalOpen] = useState(false);
  const [isQuickEventModalOpen, setIsQuickEventModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewMemberModal={() => setIsQuickMemberModalOpen(true)}
            onOpenNewEventModal={() => setIsQuickEventModalOpen(true)}
          />
        );
      case 'membros':
        return <MembersView />;
      case 'departamentos':
        return <DepartmentsView />;
      case 'calendario':
        return <CalendarView />;
      case 'escalas':
        return <SchedulesView />;
      case 'financeiro':
        return <FinancesView />;
      case 'relatorios':
        return <ReportsView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onOpenNewMemberModal={() => setIsQuickMemberModalOpen(true)}
            onOpenNewEventModal={() => setIsQuickEventModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area (shifted on desktop for 72 = 18rem sidebar) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenQuickMemberModal={() => setIsQuickMemberModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <MemberCardModal
        member={selectedMemberForCard}
        churchProfile={churchProfile}
        onClose={() => setSelectedMemberForCard(null)}
      />

      <MemberFormModal
        isOpen={isQuickMemberModalOpen}
        onClose={() => setIsQuickMemberModalOpen(false)}
      />

      <EventFormModal
        isOpen={isQuickEventModalOpen}
        onClose={() => setIsQuickEventModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ChurchProvider>
      <AppContent />
    </ChurchProvider>
  );
}
