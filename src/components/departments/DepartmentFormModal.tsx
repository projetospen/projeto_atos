import React, { useState } from 'react';
import { Department } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, Building2, User, Calendar, DollarSign, Save } from 'lucide-react';

interface DepartmentFormModalProps {
  department?: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  department,
  isOpen,
  onClose,
}) => {
  const { addDepartment, updateDepartment, members, theme } = useChurch();

  const [formData, setFormData] = useState({
    name: department?.name || '',
    slug: department?.slug || '',
    description: department?.description || '',
    iconName: department?.iconName || 'Church',
    color: department?.color || 'from-amber-500 to-orange-600',
    leaderMemberId: department?.leaderMemberId || (members[0]?.id || ''),
    viceLeaderMemberId: department?.viceLeaderMemberId || '',
    meetingSchedule: department?.meetingSchedule || '',
    meetingLocation: department?.meetingLocation || '',
    monthlyBudget: department?.monthlyBudget || 1000,
    goalsText: department?.goals ? department.goals.join('\n') : '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const goals = formData.goalsText
      .split('\n')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: formData.description.trim(),
      iconName: formData.iconName,
      color: formData.color,
      leaderMemberId: formData.leaderMemberId,
      viceLeaderMemberId: formData.viceLeaderMemberId || undefined,
      meetingSchedule: formData.meetingSchedule.trim() || undefined,
      meetingLocation: formData.meetingLocation.trim() || undefined,
      monthlyBudget: Number(formData.monthlyBudget),
      goals: goals.length > 0 ? goals : undefined,
    };

    if (department) {
      updateDepartment(department.id, payload);
    } else {
      addDepartment(payload);
    }

    onClose();
  };

  const colorOptions = [
    { label: 'Azul Índigo', class: 'from-blue-600 to-indigo-700' },
    { label: 'Âmbar Dourado', class: 'from-amber-500 to-orange-600' },
    { label: 'Rosa Kids', class: 'from-pink-500 to-rose-600' },
    { label: 'Roxo Jovens', class: 'from-purple-600 to-violet-700' },
    { label: 'Verde EBD', class: 'from-emerald-600 to-teal-700' },
    { label: 'Ciano Mídia', class: 'from-cyan-600 to-blue-700' },
    { label: 'Verde Missões', class: 'from-green-600 to-emerald-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {department ? 'Editar Departamento' : 'Novo Departamento / Ministério'}
            </h3>
            <p className="text-xs text-slate-500">Defina liderança, agenda de reuniões e metas do ministério</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome do Ministério / Departamento *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Ministério de Louvor & Adoração"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Descrição / Propósito Ministerial</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o propósito e escopo de atuação do departamento..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Líder / Coordenador Titular *</label>
              <select
                required
                value={formData.leaderMemberId}
                onChange={e => setFormData({ ...formData, leaderMemberId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="">Selecione um líder membro...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Vice-Líder / Auxiliar (Opcional)</label>
              <select
                value={formData.viceLeaderMemberId}
                onChange={e => setFormData({ ...formData, viceLeaderMemberId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="">Nenhum</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dias e Horários de Reunião/Ensaio</label>
              <input
                type="text"
                value={formData.meetingSchedule}
                onChange={e => setFormData({ ...formData, meetingSchedule: e.target.value })}
                placeholder="Ex: Sábados às 16h00"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Local da Reunião</label>
              <input
                type="text"
                value={formData.meetingLocation}
                onChange={e => setFormData({ ...formData, meetingLocation: e.target.value })}
                placeholder="Ex: Templo Principal / Sala Kids"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Orçamento Mensal Estimado (R$)</label>
              <input
                type="number"
                min="0"
                value={formData.monthlyBudget}
                onChange={e => setFormData({ ...formData, monthlyBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tema Visual / Cor</label>
              <select
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              >
                {colorOptions.map(c => (
                  <option key={c.class} value={c.class}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Metas do Ministério para o Ano (uma por linha)
            </label>
            <textarea
              rows={3}
              value={formData.goalsText}
              onChange={e => setFormData({ ...formData, goalsText: e.target.value })}
              placeholder="Ex: Realizar workshop de formação&#10;Adquirir novos instrumentos&#10;Ampliar a equipe em 5 voluntários"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: theme.primaryHex,
                color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer hover:opacity-90"
            >
              <Save className="w-4 h-4" />
              <span>{department ? 'Salvar Departamento' : 'Criar Departamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
