import React, { useState, useMemo } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchEvent, EventCategory } from '../../types';
import { EventFormModal } from './EventFormModal';
import { 
  CalendarDays, 
  CalendarPlus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Trash2, 
  Edit3, 
  Download, 
  List, 
  Grid3X3,
  Sparkles,
  Share2
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { events, deleteEvent, departments, churchProfile } = useChurch();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewType, setViewType] = useState<'grid' | 'agenda'>('grid');
  const [selectedDay, setSelectedDay] = useState<number | null>(25);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState<string | undefined>();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDay(25);
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const categoryMatch = selectedCategory === 'all' || e.category === selectedCategory;
      const deptMatch = selectedDepartment === 'all' || e.departmentId === selectedDepartment;
      return categoryMatch && deptMatch;
    });
  }, [events, selectedCategory, selectedDepartment]);

  // Calendar days generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prefixBlanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Events of current month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const eventsInCurrentMonth = filteredEvents.filter(e => e.startDate.startsWith(currentMonthPrefix));

  // Events for selected day
  const selectedDayEvents = selectedDay 
    ? eventsInCurrentMonth.filter(e => e.startDate === `${currentMonthPrefix}-${String(selectedDay).padStart(2, '0')}`)
    : [];

  const handleAddForDate = (day: number) => {
    const formatted = `${currentMonthPrefix}-${String(day).padStart(2, '0')}`;
    setFormDefaultDate(formatted);
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt: ChurchEvent) => {
    setEditingEvent(evt);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Deseja remover o evento "${title}" do calendário?`)) {
      deleteEvent(id);
    }
  };

  // Helper for category badge styling
  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'culto_geral':
        return { label: 'Culto Geral', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'santa_ceia':
        return { label: 'Santa Ceia', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
      case 'ebd':
        return { label: 'EBD', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'culto_jovens':
        return { label: 'Juventude', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'oracao':
        return { label: 'Oração', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
      case 'ensaio':
        return { label: 'Ensaio', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'acao_social':
        return { label: 'Ação Social', bg: 'bg-green-100 text-green-800 border-green-200' };
      default:
        return { label: 'Evento', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  // Generate .ics calendar file for download
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ATOS Admin//PT\n";
    filteredEvents.forEach(e => {
      const dStart = e.startDate.replace(/-/g, '') + 'T' + e.startTime.replace(/:/g, '') + '00';
      const endTimeFormatted = e.endTime ? e.endTime.replace(/:/g, '') + '00' : '220000';
      const dEnd = e.startDate.replace(/-/g, '') + 'T' + endTimeFormatted;
      icsContent += `BEGIN:VEVENT\nSUMMARY:${e.title}\nDESCRIPTION:${e.description}\nLOCATION:${e.location}\nDTSTART:${dStart}\nDTEND:${dEnd}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calendario_igreja_${year}_${month + 1}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>Calendário Eclesiástico & Cultos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agendamento oficial de cultos de celebração, EBD, reuniões de liderança e ensaios
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 cursor-pointer"
            title="Exportar para Google Agenda / iCalendar"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar .ICS</span>
          </button>

          <button
            onClick={() => {
              setEditingEvent(null);
              setFormDefaultDate(undefined);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Agendar Evento</span>
          </button>
        </div>
      </div>

      {/* Month Navigation & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-extrabold text-base text-slate-800 tracking-tight">
            {monthNames[month]} {year}
          </h3>

          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
          >
            Hoje
          </button>
        </div>

        {/* Filters & View Switches */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden text-slate-700"
          >
            <option value="all">Todas as Categorias</option>
            <option value="culto_geral">Cultos Gerais</option>
            <option value="santa_ceia">Santa Ceia</option>
            <option value="ebd">EBD</option>
            <option value="culto_jovens">Jovens</option>
            <option value="oracao">Oração</option>
            <option value="ensaio">Ensaios</option>
            <option value="acao_social">Ação Social</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden text-slate-700"
          >
            <option value="all">Todos os Ministérios</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>
            ))}
          </select>

          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 transition-colors ${viewType === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              title="Grade Mensal"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('agenda')}
              className={`p-2 transition-colors ${viewType === 'agenda' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              title="Lista de Agenda"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewType === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 7-column Calendar */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 uppercase text-[11px] pb-2 border-b border-slate-100">
              <span className="text-amber-600">DOM</span>
              <span>SEG</span>
              <span>TER</span>
              <span>QUA</span>
              <span>QUI</span>
              <span>SEX</span>
              <span className="text-indigo-600">SÁB</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 mt-2">
              {prefixBlanks.map(b => (
                <div key={`blank-${b}`} className="min-h-[85px] sm:min-h-[105px] p-1.5 bg-slate-50/40 rounded-xl border border-dashed border-slate-100" />
              ))}

              {daysArray.map(day => {
                const dateKey = `${currentMonthPrefix}-${String(day).padStart(2, '0')}`;
                const dayEvents = eventsInCurrentMonth.filter(e => e.startDate === dateKey);
                const isSelected = selectedDay === day;
                const isToday = day === 25; // 25 Oct 2026

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/30 shadow-xs' 
                        : isToday 
                        ? 'border-amber-400 bg-amber-50/30' 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-amber-500 text-slate-950 shadow-xs' 
                          : isSelected 
                          ? 'bg-emerald-600 text-white' 
                          : 'text-slate-700'
                      }`}>
                        {day}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Event badges preview inside day box */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map(evt => {
                        const badge = getCategoryBadge(evt.category);
                        return (
                          <div 
                            key={evt.id}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-medium truncate ${badge.bg}`}
                            title={`${evt.startTime} - ${evt.title}`}
                          >
                            {evt.startTime} {evt.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-slate-400 font-semibold px-1">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Detail Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Programação do Dia</span>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {selectedDay ? `${selectedDay} de ${monthNames[month]}` : 'Selecione um dia'}
                  </h3>
                </div>
                {selectedDay && (
                  <button
                    onClick={() => handleAddForDate(selectedDay)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Adicionar evento neste dia"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Novo</span>
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <CalendarDays className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Nenhum evento neste dia</p>
                    <p className="text-[11px] mt-1">Clique em "Novo" para agendar um culto ou reunião.</p>
                  </div>
                ) : (
                  selectedDayEvents.map(evt => {
                    const badge = getCategoryBadge(evt.category);
                    const dept = departments.find(d => d.id === evt.departmentId);

                    return (
                      <div key={evt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(evt)}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Editar evento"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(evt.id, evt.title)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Remover evento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-xs text-slate-800 leading-tight">{evt.title}</h4>
                        
                        <div className="space-y-1 text-[11px] text-slate-500">
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.startTime} {evt.endTime && `às ${evt.endTime}`}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.location}</span>
                          </p>
                          {evt.speakerOrPreacher && (
                            <p className="flex items-center gap-1.5 text-amber-700 font-medium">
                              <User className="w-3.5 h-3.5" />
                              <span>{evt.speakerOrPreacher}</span>
                            </p>
                          )}
                        </div>

                        {evt.description && (
                          <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {selectedDay && selectedDayEvents.length > 0 && (
              <div className="pt-3 border-t border-slate-100 mt-4 text-center">
                <span className="text-[11px] text-slate-400">
                  {selectedDayEvents.length} atividade(s) agendada(s)
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AGENDA LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="space-y-4">
            {filteredEvents.map(evt => {
              const badge = getCategoryBadge(evt.category);
              const dept = departments.find(d => d.id === evt.departmentId);
              const [y, m, d] = evt.startDate.split('-');

              return (
                <div 
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center shrink-0 shadow-sm">
                      <span className="text-[10px] font-bold uppercase text-amber-400">
                        {monthNames[parseInt(m) - 1].slice(0, 3)}
                      </span>
                      <span className="text-lg font-black leading-none">{d}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {dept && (
                          <span className="text-[10px] font-medium text-slate-500">
                            • {dept.name}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-800 leading-tight">{evt.title}</h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.startTime} {evt.endTime && `- ${evt.endTime}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.location}
                        </span>
                        {evt.speakerOrPreacher && (
                          <span className="text-amber-800 font-medium">
                            Preletor: {evt.speakerOrPreacher}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id, evt.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      <EventFormModal
        isOpen={isFormOpen}
        event={editingEvent}
        defaultDate={formDefaultDate}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};
