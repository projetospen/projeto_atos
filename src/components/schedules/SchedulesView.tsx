import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { VolunteerDuty } from '../../types';
import { DutyFormModal } from './DutyFormModal';
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Share2, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

export const SchedulesView: React.FC = () => {
  const { duties, deleteDuty, toggleDutyConfirmation, departments, members, churchProfile } = useChurch();

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState<VolunteerDuty | null>(null);
  const [copiedDutyId, setCopiedDutyId] = useState<string | null>(null);

  const filteredDuties = selectedDept === 'all' 
    ? duties 
    : duties.filter(d => d.departmentId === selectedDept);

  const handleOpenAdd = () => {
    setEditingDuty(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (duty: VolunteerDuty) => {
    setEditingDuty(duty);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta escala?')) {
      deleteDuty(id);
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // Generate WhatsApp formatted text and copy to clipboard
  const handleCopyWhatsApp = (duty: VolunteerDuty) => {
    const dept = departments.find(d => d.id === duty.departmentId);
    let text = `📋 *ESCALA DE MINISTÉRIO - ${churchProfile.name.toUpperCase()}*\n`;
    text += `📅 *Data:* ${formatDate(duty.date)}\n`;
    text += `⛪ *Culto:* ${duty.serviceTitle}\n`;
    if (dept) text += `👥 *Departamento:* ${dept.name}\n\n`;

    duty.roles.forEach(r => {
      const member = members.find(m => m.id === r.memberId);
      const memberName = member ? member.name : 'A definir';
      const statusIcon = r.confirmed ? '✅' : '⏳';
      text += `• *${r.roleName}:* ${memberName} ${statusIcon}\n`;
    });

    if (duty.notes) {
      text += `\n⚠️ *Avisos:* ${duty.notes}\n`;
    }

    text += `\n"Tudo o que fizerem, façam de todo o coração, como para o Senhor" (Colossenses 3:23)`;

    navigator.clipboard.writeText(text);
    setCopiedDutyId(duty.id);
    setTimeout(() => setCopiedDutyId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <span>Escalas de Voluntários & Ministérios</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organização das equipes de louvor, diaconia, recepção, kids e tecnologia para os cultos
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Escala</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filtrar por Departamento:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden text-slate-700 font-medium"
          >
            <option value="all">Todos os Ministérios</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          {filteredDuties.length} escala(s) ativa(s)
        </span>
      </div>

      {/* Duties Grid */}
      {filteredDuties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Nenhuma escala cadastrada</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Crie escalas semanais para coordenar os voluntários nos cultos da igreja.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Escala Agora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDuties.map(duty => {
            const dept = departments.find(d => d.id === duty.departmentId);
            const confirmedCount = duty.roles.filter(r => r.confirmed).length;
            const isAllConfirmed = confirmedCount === duty.roles.length && duty.roles.length > 0;
            const isCopied = copiedDutyId === duty.id;

            return (
              <div 
                key={duty.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Header of duty */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {dept?.name || 'Ministério'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(duty.date)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                        {duty.serviceTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(duty)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Editar escala"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(duty.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Excluir escala"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Confirmation Progress */}
                  <div className="my-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Confirmação de Presença:</span>
                    <span className={`font-semibold ${isAllConfirmed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {confirmedCount} de {duty.roles.length} confirmados
                    </span>
                  </div>

                  {/* Roles list */}
                  <div className="space-y-2">
                    {duty.roles.map((role, idx) => {
                      const member = members.find(m => m.id === role.memberId);
                      return (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">{role.roleName}</span>
                            <span className="font-bold text-slate-800">{member?.name || 'Não atribuído'}</span>
                          </div>

                          <button
                            onClick={() => toggleDutyConfirmation(duty.id, idx)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              role.confirmed 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Clique para alternar status de confirmação"
                          >
                            {role.confirmed ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>Confirmado</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Pendente</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  {duty.notes && (
                    <p className="mt-3 text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                      <strong>Orientação:</strong> {duty.notes}
                    </p>
                  )}
                </div>

                {/* Footer with WhatsApp Export */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Clique no status para confirmar
                  </span>

                  <button
                    onClick={() => handleCopyWhatsApp(duty)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isCopied 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado para WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copiar para WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <DutyFormModal
        isOpen={isFormOpen}
        duty={editingDuty}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};
