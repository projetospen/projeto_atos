import React, { useState } from 'react';
import { ChurchEvent, EventCategory } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, Calendar, Clock, MapPin, User, Building2, Save } from 'lucide-react';

interface EventFormModalProps {
  event?: ChurchEvent | null;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  event,
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { addEvent, updateEvent, departments } = useChurch();

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: (event?.category || 'culto_geral') as EventCategory,
    startDate: event?.startDate || defaultDate || '2026-10-25',
    startTime: event?.startTime || '19:00',
    endDate: event?.endDate || '',
    endTime: event?.endTime || '21:00',
    location: event?.location || 'Templo Principal',
    departmentId: event?.departmentId || '',
    speakerOrPreacher: event?.speakerOrPreacher || '',
    targetAudience: event?.targetAudience || 'Toda a Igreja',
    isRecurring: event?.isRecurring ?? false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate || undefined,
      endTime: formData.endTime || undefined,
      location: formData.location.trim(),
      departmentId: formData.departmentId || undefined,
      speakerOrPreacher: formData.speakerOrPreacher.trim() || undefined,
      targetAudience: formData.targetAudience.trim() || undefined,
      isRecurring: formData.isRecurring,
    };

    if (event) {
      updateEvent(event.id, payload);
    } else {
      addEvent(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {event ? 'Editar Evento / Culto' : 'Novo Evento / Culto'}
            </h3>
            <p className="text-xs text-slate-500">Agende cultos, reuniões, ensaios e conferências eclesiásticas</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Título do Evento / Culto *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Culto de Celebração & Santa Ceia"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="culto_geral">Culto Geral / Celebração</option>
                <option value="santa_ceia">Santa Ceia do Senhor</option>
                <option value="ebd">Escola Bíblica Dominical (EBD)</option>
                <option value="culto_jovens">Culto de Jovens</option>
                <option value="oracao">Reunião de Oração & Doutrina</option>
                <option value="ensaio">Ensaio de Louvor / Coral</option>
                <option value="batismo">Culto de Batismo</option>
                <option value="acao_social">Ação Social / Comunitária</option>
                <option value="conferencia">Conferência / Congresso</option>
                <option value="reuniao_lideranca">Reunião de Liderança</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Departamento Responsável</label>
              <select
                value={formData.departmentId}
                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="">Geral da Igreja</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Horário Início *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Horário Término</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="Templo Principal / Salão Social"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preletor / Responsável</label>
              <input
                type="text"
                value={formData.speakerOrPreacher}
                onChange={e => setFormData({ ...formData, speakerOrPreacher: e.target.value })}
                placeholder="Pr. Marcos Vinícius / Convidado"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Público-Alvo</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Toda a Igreja, Jovens, Casais..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Descrição / Observações</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes adicionais, passagens bíblicas tema, ou orientações..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="isRecurring" className="text-slate-700 font-medium cursor-pointer">
              Evento semanal recorrente (repete toda semana no mesmo dia)
            </label>
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
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{event ? 'Salvar Evento' : 'Agendar Evento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
