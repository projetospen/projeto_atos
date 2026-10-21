import React, { useState } from 'react';
import { VolunteerDuty } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, Plus, Trash2, Save, ClipboardCheck, User } from 'lucide-react';

interface DutyFormModalProps {
  duty?: VolunteerDuty | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DutyFormModal: React.FC<DutyFormModalProps> = ({
  duty,
  isOpen,
  onClose,
}) => {
  const { addDuty, updateDuty, departments, members } = useChurch();

  const [serviceTitle, setServiceTitle] = useState(duty?.serviceTitle || 'Culto de Celebração de Domingo (Noite)');
  const [date, setDate] = useState(duty?.date || '2026-10-25');
  const [departmentId, setDepartmentId] = useState(duty?.departmentId || (departments[0]?.id || ''));
  const [notes, setNotes] = useState(duty?.notes || '');

  const [roles, setRoles] = useState<{ roleName: string; memberId: string; confirmed: boolean }[]>(
    duty?.roles || [
      { roleName: 'Ministro de Louvor (Voz)', memberId: members[2]?.id || '', confirmed: true },
      { roleName: 'Instrumentista / Teclado', memberId: members[0]?.id || '', confirmed: false },
    ]
  );

  if (!isOpen) return null;

  const handleAddRoleRow = () => {
    setRoles([...roles, { roleName: '', memberId: members[0]?.id || '', confirmed: false }]);
  };

  const handleRemoveRoleRow = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, field: string, value: any) => {
    const updated = [...roles];
    (updated[index] as any)[field] = value;
    setRoles(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim() || roles.length === 0) return;

    const payload = {
      serviceTitle: serviceTitle.trim(),
      date,
      departmentId,
      notes: notes.trim() || undefined,
      roles: roles.filter(r => r.roleName.trim() && r.memberId),
    };

    if (duty) {
      updateDuty(duty.id, payload);
    } else {
      addDuty(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {duty ? 'Editar Escala de Culto' : 'Nova Escala de Voluntários'}
            </h3>
            <p className="text-xs text-slate-500">Distribua voluntários para funções e compartilhe a escala</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Culto / Ocasião *</label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={e => setServiceTitle(e.target.value)}
              placeholder="Ex: Culto de Domingo Noite (18h) ou Santa Ceia"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data da Escala *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Departamento / Ministério *</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Volunteer Roles List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700">Funções & Voluntários Escalados</label>
              <button
                type="button"
                onClick={handleAddRoleRow}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Função</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {roles.map((r, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={r.roleName}
                    onChange={e => handleRoleChange(idx, 'roleName', e.target.value)}
                    placeholder="Função (ex: Vocal, Som, Porta 1)"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                  
                  <select
                    value={r.memberId}
                    onChange={e => handleRoleChange(idx, 'memberId', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
                  >
                    <option value="">Selecione o membro...</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>

                  <label className="flex items-center gap-1 text-[11px] text-slate-600 px-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.confirmed}
                      onChange={e => handleRoleChange(idx, 'confirmed', e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="hidden sm:inline">Confirmado</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveRoleRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Orientações aos Escalados</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Chegar com 30 min de antecedência para oração e passagem de som"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
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
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{duty ? 'Salvar Escala' : 'Criar Escala'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
