import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { Department } from '../../types';
import { DepartmentFormModal } from './DepartmentFormModal';
import { DepartmentDetailsModal } from './DepartmentDetailsModal';
import { 
  Building2, 
  Plus, 
  Users, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  Music, 
  Baby, 
  Flame, 
  BookOpen, 
  Video, 
  Globe, 
  HeartHandshake,
  Church,
  Target,
  ShieldCheck,
  Wallet,
  ArrowDownRight,
  Receipt,
  Pencil,
  Edit3
} from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { departments, members, theme, adminRole, currentUser, transactions } = useChurch();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [detailsDept, setDetailsDept] = useState<Department | null>(null);

  // If role is Líder de Ministério, each leader only has access to their own department
  const isMinistryLeader = adminRole === 'Líder de Ministério';
  const leaderDeptId = currentUser?.departmentId || 'dep-1';
  
  const visibleDepartments = isMinistryLeader
    ? departments.filter(d => d.id === leaderDeptId || d.name === currentUser?.departmentName)
    : departments;

  const handleOpenAdd = () => {
    setEditingDept(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setIsFormOpen(true);
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Helper for department icon
  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Music': return Music;
      case 'Baby': return Baby;
      case 'Flame': return Flame;
      case 'BookOpen': return BookOpen;
      case 'Video': return Video;
      case 'Globe': return Globe;
      case 'HeartHandshake': return HeartHandshake;
      default: return Church;
    }
  };

  return (
    <div className="space-y-6">
      {/* Ministerial Scope Alert for Leaders */}
      {isMinistryLeader && (
        <div 
          className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          style={{ 
            backgroundColor: `${theme.primaryHex}15`, 
            borderColor: `${theme.primaryHex}40` 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Seu Departamento Ministerial: {visibleDepartments[0]?.name || currentUser?.departmentName || 'Setor Designado'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                Olá, <strong>{currentUser?.name}</strong>. Como Líder de Ministério, você possui acesso exclusivo para gerenciar os voluntários, metas e escalas deste departamento.
              </p>
            </div>
          </div>
          <span 
            className="self-start sm:self-center px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            Líder Ministerial
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: theme.primaryHex }} />
            <span>
              {isMinistryLeader 
                ? (visibleDepartments[0]?.name || 'Meu Departamento Ministerial')
                : 'Departamentos & Ministérios'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isMinistryLeader
              ? 'Gestão da sua equipe de voluntários, reuniões, metas e controle de gastos do caixa'
              : 'Organização dos ministérios, lideranças, escalas de trabalho, voluntários e caixa do departamento com controle de gastos'}
          </p>
        </div>

        {/* Only Pastor Presidente & General Admins can create new departments */}
        {!isMinistryLeader && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: theme.primaryHex }}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Departamento</span>
          </button>
        )}
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleDepartments.map((dept) => {
          const leader = members.find(m => m.id === dept.leaderMemberId);
          const deptVolunteers = members.filter(m => m.departmentIds?.includes(dept.id));
          const IconComponent = getDeptIcon(dept.iconName);

          return (
            <div 
              key={dept.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Gradient Header */}
                <div className={`p-4 bg-gradient-to-r ${dept.color} text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">{dept.name}</h3>
                      <span className="text-[10px] text-white/80 font-medium">
                        {deptVolunteers.length} Voluntários
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed text-[11px]">
                    {dept.description}
                  </p>

                  {/* Leader Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                      {leader?.photoUrl ? (
                        <img src={leader.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 text-xs">
                          {leader?.name.charAt(0) || 'L'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span 
                        className="text-[9px] uppercase font-bold block"
                        style={{ color: theme.primaryHex }}
                      >
                        Líder Responsável
                      </span>
                      <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{leader?.name || 'Não atribuído'}</p>
                    </div>
                  </div>

                  {/* Caixa do Departamento & Controle de Gastos */}
                  {(() => {
                    const initialCash = dept.initialCash ?? dept.monthlyBudget ?? 0;
                    const deptTxs = transactions.filter(t => t.departmentId === dept.id);
                    const totalEntries = deptTxs.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
                    const totalExpenses = deptTxs.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
                    const currentBalance = initialCash + totalEntries - totalExpenses;

                    return (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 text-xs">
                            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Caixa do Departamento</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span 
                              onClick={() => setDetailsDept(dept)}
                              title="Clique para abrir o caixa e cadastrar entradas/saídas"
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                                currentBalance >= 0 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' 
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                              }`}
                            >
                              Saldo: {formatCurrency(currentBalance)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDetailsDept(dept)}
                              title="Abrir opções de caixa para cadastrar entradas e saídas de receitas"
                              className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Gastos Totais</span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              {formatCurrency(totalExpenses)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Fundo Base</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {formatCurrency(initialCash)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Details metadata */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    {dept.meetingSchedule && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{dept.meetingSchedule}</span>
                      </p>
                    )}
                  </div>

                  {/* Goals count preview */}
                  {dept.goals && dept.goals.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
                        <span>{dept.goals.length} metas cadastradas</span>
                      </span>
                      <span 
                        onClick={() => setDetailsDept(dept)}
                        className="font-semibold cursor-pointer hover:underline"
                        style={{ color: theme.primaryHex }}
                      >
                        Ver detalhes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom footer button: only Editar departamento */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  title="Editar informações gerais, liderança e metas do departamento"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Editar departamento</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <DepartmentFormModal
        isOpen={isFormOpen}
        department={editingDept}
        onClose={() => setIsFormOpen(false)}
      />

      <DepartmentDetailsModal
        department={detailsDept}
        onClose={() => setDetailsDept(null)}
        onEdit={handleOpenEdit}
      />
    </div>
  );
};
