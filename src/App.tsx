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
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';
import { LoginView } from './components/auth/LoginView';
import { ROLE_PERMISSIONS } from './types';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    selectedMemberForCard, 
    setSelectedMemberForCard, 
    churchProfile,
    isAuthenticated,
    adminRole,
    currentUser,
    isTabAllowed,
    theme
  } = useChurch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickMemberModalOpen, setIsQuickMemberModalOpen] = useState(false);
  const [isQuickEventModalOpen, setIsQuickEventModalOpen] = useState(false);

  // Auto-redirect if on a tab not allowed for current role
  React.useEffect(() => {
    if (isAuthenticated && !isTabAllowed(activeTab)) {
      const userRole = currentUser?.role || adminRole;
      const allowedDefault = ROLE_PERMISSIONS[userRole]?.defaultTab || 'dashboard';
      setActiveTab(isTabAllowed(allowedDefault) ? allowedDefault : 'membros');
    }
  }, [adminRole, currentUser?.role, activeTab, isAuthenticated, churchProfile?.roleModulesConfig, churchProfile?.enabledModules]);

  // If not logged in, present ecclesiastical login screen so another account can sign in
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    // Check permission for active view
    if (!isTabAllowed(activeTab)) {
      const perms = ROLE_PERMISSIONS[adminRole];
      return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Acesso Restrito ao Módulo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              O seu perfil de <strong>{adminRole}</strong> não possui autorização para acessar este conteúdo.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              Seu escopo permitido:
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {perms?.description || perms?.scopeLabel}
            </p>
          </div>
          <button
            onClick={() => setActiveTab(perms?.defaultTab || 'membros')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            style={{ backgroundColor: theme.primaryHex }}
          >
            <span>Ir para meu módulo autorizado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
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

      <ThemeCustomizerModal />
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
