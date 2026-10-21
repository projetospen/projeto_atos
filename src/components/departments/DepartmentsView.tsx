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
  Target
} from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { departments, members } = useChurch();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [detailsDept, setDetailsDept] = useState<Department | null>(null);

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Departamentos & Ministérios</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organização dos ministérios, lideranças, escalas de trabalho, voluntários e orçamentos
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Departamento</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const leader = members.find(m => m.id === dept.leaderMemberId);
          const deptVolunteers = members.filter(m => m.departmentIds?.includes(dept.id));
          const IconComponent = getDeptIcon(dept.iconName);

          return (
            <div 
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
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
                  <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                    {dept.description}
                  </p>

                  {/* Leader Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      {leader?.photoUrl ? (
                        <img src={leader.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                          {leader?.name.charAt(0) || 'L'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold text-amber-700 block">Líder Responsável</span>
                      <p className="font-bold text-slate-800 text-xs truncate">{leader?.name || 'Não atribuído'}</p>
                    </div>
                  </div>

                  {/* Details metadata */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 pt-1">
                    {dept.meetingSchedule && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{dept.meetingSchedule}</span>
                      </p>
                    )}
                    {dept.monthlyBudget && (
                      <p className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Fundo Mensal: <strong className="text-slate-700">{formatCurrency(dept.monthlyBudget)}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Goals count preview */}
                  {dept.goals && dept.goals.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-amber-500" />
                        <span>{dept.goals.length} metas cadastradas</span>
                      </span>
                      <span className="text-indigo-600 font-semibold group-hover:underline">
                        Ver detalhes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDetailsDept(dept)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-indigo-50/50 cursor-pointer"
                >
                  <span>Gerenciar Equipe</span>
                  <ChevronRight className="w-3.5 h-3.5" />
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
