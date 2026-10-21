import React from 'react';
import { Department } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { 
  X, 
  Building2, 
  User, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Target, 
  Edit3, 
  Trash2, 
  MessageCircle,
  CreditCard 
} from 'lucide-react';

interface DepartmentDetailsModalProps {
  department: Department | null;
  onClose: () => void;
  onEdit: (dept: Department) => void;
}

export const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({
  department,
  onClose,
  onEdit,
}) => {
  const { members, deleteDepartment, setSelectedMemberForCard } = useChurch();

  if (!department) return null;

  const leader = members.find(m => m.id === department.leaderMemberId);
  const viceLeader = members.find(m => m.id === department.viceLeaderMemberId);
  const deptMembers = members.filter(m => m.departmentIds?.includes(department.id));

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o departamento ${department.name}?`)) {
      deleteDepartment(department.id);
      onClose();
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Banner with Department Theme */}
        <div className={`p-6 bg-gradient-to-r ${department.color} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Ministério Eclesiástico</span>
              <h2 className="text-xl font-extrabold text-white">{department.name}</h2>
            </div>
          </div>
          <p className="text-xs text-white/90 leading-relaxed max-w-xl">
            {department.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="font-semibold text-slate-800">{deptMembers.length} Voluntários Integrados</span>
            <span>•</span>
            <span>Orçamento: <strong className="text-slate-900">{formatCurrency(department.monthlyBudget)}/mês</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(department);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
              title="Excluir departamento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
          {/* Liderança Responsável */}
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Liderança do Ministério
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {leader ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      {leader.photoUrl ? (
                        <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                          {leader.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{leader.name}</p>
                      <span className="text-[10px] text-amber-700 font-semibold block">Líder Titular</span>
                      <span className="text-[10px] text-slate-500">{leader.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/55${leader.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">Líder não atribuído</div>
              )}

              {viceLeader ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      {viceLeader.photoUrl ? (
                        <img src={viceLeader.photoUrl} alt={viceLeader.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                          {viceLeader.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{viceLeader.name}</p>
                      <span className="text-[10px] text-indigo-700 font-semibold block">Vice-Líder / Auxiliar</span>
                      <span className="text-[10px] text-slate-500">{viceLeader.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/55${viceLeader.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {/* Agenda & Local */}
          {(department.meetingSchedule || department.meetingLocation) && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {department.meetingSchedule && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Encontros & Ensaios</span>
                    <span className="font-semibold text-slate-800">{department.meetingSchedule}</span>
                  </div>
                </div>
              )}
              {department.meetingLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Local de Reunião</span>
                    <span className="font-semibold text-slate-800">{department.meetingLocation}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metas do Ministério */}
          {department.goals && department.goals.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Metas & Objetivos do Ano</span>
              </h4>
              <div className="space-y-1.5">
                {department.goals.map((g, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-tight">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Membros do Departamento */}
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Equipe de Voluntários ({deptMembers.length})</span>
            </h4>
            {deptMembers.length === 0 ? (
              <p className="text-slate-400 italic">Nenhum membro vinculado a este ministério ainda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deptMembers.map(m => (
                  <div 
                    key={m.id}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMemberForCard(m)}
                      title="Ver Carteirinha"
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
