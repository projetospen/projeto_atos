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
  const { events, deleteEvent, departments, churchProfile, theme } = useChurch();

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

  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const eventsInCurrentMonth = useMemo(() => {
    return filteredEvents.filter(e => e.startDate.startsWith(currentMonthPrefix));
  }, [filteredEvents, currentMonthPrefix]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    const dateKey = `${currentMonthPrefix}-${String(selectedDay).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.startDate === dateKey);
  }, [selectedDay, currentMonthPrefix, filteredEvents]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormDefaultDate(undefined);
    setIsFormOpen(true);
  };

  const handleAddForDate = (day: number) => {
    const formattedDate = `${currentMonthPrefix}-${String(day).padStart(2, '0')}`;
    setEditingEvent(null);
    setFormDefaultDate(formattedDate);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event: ChurchEvent) => {
    setEditingEvent(event);
    setFormDefaultDate(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Deseja remover o evento "${title}" do calendário da igreja?`)) {
      deleteEvent(id);
    }
  };

  // Category styles
  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'culto_geral':
        return { label: 'Culto de Celebração', bg: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' };
      case 'santa_ceia':
        return { label: 'Santa Ceia do Senhor', bg: 'bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' };
      case 'ebd':
        return { label: 'Escola Bíblica (EBD)', bg: 'bg-teal-100 text-teal-900 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800' };
      case 'culto_jovens':
        return { label: 'Culto de Jovens', bg: 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' };
      case 'oracao':
        return { label: 'Clamor & Oração', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
      case 'ensaio':
        return { label: 'Ensaio Ministerial', bg: 'bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800' };
      default:
        return { label: 'Evento', bg: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5" style={{ color: theme.primaryHex }} />
            <span>Calendário Eclesiástico & Cultos</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agendamento oficial de cultos de celebração, EBD, reuniões de liderança e ensaios
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Exportar para Google Agenda / iCalendar"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Exportar .ICS</span>
          </button>

          <button
            onClick={() => {
              setEditingEvent(null);
              setFormDefaultDate(undefined);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: theme.primaryHex }}
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Agendar Evento</span>
          </button>
        </div>
      </div>

      {/* Month Navigation & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight">
            {monthNames[month]} {year}
          </h3>

          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
          >
            Hoje
          </button>
        </div>

        {/* Filters & View Switches */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200"
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
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-700 dark:text-slate-200"
          >
            <option value="all">Todos os Ministérios</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>
            ))}
          </select>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewType('grid')}
              style={viewType === 'grid' ? { backgroundColor: theme.primaryHex, color: '#ffffff' } : undefined}
              className={`p-2 transition-colors cursor-pointer ${viewType === 'grid' ? 'font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
              title="Grade Mensal"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('agenda')}
              style={viewType === 'agenda' ? { backgroundColor: theme.primaryHex, color: '#ffffff' } : undefined}
              className={`p-2 transition-colors cursor-pointer ${viewType === 'agenda' ? 'font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
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
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 dark:text-slate-500 uppercase text-[11px] pb-2 border-b border-slate-100 dark:border-slate-800">
              <span style={{ color: theme.primaryHex }}>DOM</span>
              <span>SEG</span>
              <span>TER</span>
              <span>QUA</span>
              <span>QUI</span>
              <span>SEX</span>
              <span className="text-slate-500 dark:text-slate-400">SÁB</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 mt-2">
              {prefixBlanks.map(b => (
                <div key={`blank-${b}`} className="min-h-[85px] sm:min-h-[105px] p-1.5 bg-slate-50/40 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-100 dark:border-slate-800" />
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
                    style={isSelected ? { borderColor: theme.primaryHex } : undefined}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'ring-2 shadow-xs bg-slate-50/80 dark:bg-slate-800/80' 
                        : isToday 
                        ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20' 
                        : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        style={isSelected ? { backgroundColor: theme.primaryHex, color: '#ffffff' } : undefined}
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected 
                            ? 'shadow-xs' 
                            : isToday 
                            ? 'bg-amber-500 text-slate-950 shadow-xs' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {day}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
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
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold px-1">
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
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Programação do Dia</span>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                    {selectedDay ? `${selectedDay} de ${monthNames[month]}` : 'Selecione um dia'}
                  </h3>
                </div>
                {selectedDay && (
                  <button
                    onClick={() => handleAddForDate(selectedDay)}
                    className="p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    style={{ color: theme.primaryHex }}
                    title="Adicionar evento neste dia"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Novo</span>
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
                    <CalendarDays className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Nenhum evento neste dia</p>
                    <p className="text-[11px] mt-1">Clique em "Novo" para agendar um culto ou reunião.</p>
                  </div>
                ) : (
                  selectedDayEvents.map(evt => {
                    const badge = getCategoryBadge(evt.category);
                    const dept = departments.find(d => d.id === evt.departmentId);

                    return (
                      <div key={evt.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(evt)}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                              title="Editar evento"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(evt.id, evt.title)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Remover evento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{evt.title}</h4>
                        
                        <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.startTime} {evt.endTime && `às ${evt.endTime}`}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.location}</span>
                          </p>
                          {evt.speakerOrPreacher && (
                            <p 
                              className="flex items-center gap-1.5 font-medium"
                              style={{ color: theme.primaryHex }}
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>{evt.speakerOrPreacher}</span>
                            </p>
                          )}
                        </div>

                        {evt.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
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
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
                <span className="text-[11px] text-slate-400">
                  {selectedDayEvents.length} atividade(s) agendada(s)
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AGENDA LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
          <div className="space-y-4">
            {filteredEvents.map(evt => {
              const badge = getCategoryBadge(evt.category);
              const dept = departments.find(d => d.id === evt.departmentId);
              const [y, m, d] = evt.startDate.split('-');

              return (
                <div 
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Date badge */}
                    <div 
                      className="w-14 h-14 rounded-2xl text-white flex flex-col items-center justify-center text-center shrink-0 shadow-sm"
                      style={{ backgroundColor: theme.primaryHex }}
                    >
                      <span className="text-[10px] font-bold uppercase opacity-90">
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
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            • {dept.name}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{evt.title}</h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.startTime} {evt.endTime && `- ${evt.endTime}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.location}
                        </span>
                        {evt.speakerOrPreacher && (
                          <span 
                            className="font-medium"
                            style={{ color: theme.primaryHex }}
                          >
                            Preletor: {evt.speakerOrPreacher}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
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
