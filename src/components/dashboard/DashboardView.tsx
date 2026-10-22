import React from 'react';
import { useChurch } from '../../context/ChurchContext';
import { 
  Users, 
  Building2, 
  CalendarDays, 
  Cake, 
  CircleDollarSign, 
  UserPlus, 
  CalendarPlus, 
  ClipboardCheck, 
  Receipt, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight,
  Send,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewMemberModal: () => void;
  onOpenNewEventModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenNewMemberModal,
  onOpenNewEventModal 
}) => {
  const { 
    members, 
    departments, 
    events, 
    duties, 
    transactions, 
    setActiveTab, 
    setSelectedMemberForCard,
    churchProfile,
    theme,
    currentUser
  } = useChurch();

  // Metrics
  const activeMembers = members.filter(m => m.status === 'ativo').length;
  const inObservationMembers = members.filter(m => m.status === 'em_observacao').length;
  
  // Birthdays in current month
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthBirthdays = members.filter(m => {
    if (!m.birthDate) return false;
    const parts = m.birthDate.split('-');
    return parseInt(parts[1], 10) === currentMonth;
  });

  // Finances calculation
  const totalIncome = transactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Next upcoming events (sorted by date)
  const upcomingEvents = [...events]
    .filter(e => e.startDate >= '2026-10-20')
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  // Next upcoming duty
  const nextDuty = duties.length > 0 ? duties[0] : null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.bannerGradient} text-white p-6 sm:p-8 shadow-xl border border-slate-800 transition-all`}>
        <div className="relative z-10 max-w-2xl">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${theme.bannerAccentBadge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plataforma ATOS • Gestão Eclesiástica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Graça e Paz, {currentUser?.name || 'Membro'}!
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Gestão integrada da <span className="font-semibold text-white">{churchProfile.name}</span> no sistema <strong style={{ color: theme.accentHex }}>ATOS</strong>. Acompanhe a membresia, departamentos, escalas de culto e o fluxo da tesouraria.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewMemberModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: theme.primaryHex,
                color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
              }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Cadastro de Membro</span>
            </button>
            <button
              onClick={onOpenNewEventModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" style={{ color: theme.accentHex }} />
              <span>Agendar Culto / Evento</span>
            </button>
            <button
              onClick={() => setActiveTab('escalas')}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              <span>Escalas de Domingo</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none hidden sm:block opacity-40" 
        />
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div 
          onClick={() => setActiveTab('membros')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Membresia Total</span>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{members.length}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              {activeMembers} ativos
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{inObservationMembers} em integração / visitantes</span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
          </p>
        </div>

        {/* Departments */}
        <div 
          onClick={() => setActiveTab('departamentos')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Departamentos</span>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{departments.length}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Ministérios Ativos
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Louvor, Kids, Diaconia, EBD...</span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
          </p>
        </div>

        {/* Upcoming Events */}
        <div 
          onClick={() => setActiveTab('calendario')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Eventos do Mês</span>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{events.length}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Cultos & Atividades
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{upcomingEvents.length} nos próximos 15 dias</span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
          </p>
        </div>

        {/* Financial Net Balance */}
        <div 
          onClick={() => setActiveTab('financeiro')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balanço do Mês</span>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${netBalance >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600'}`}>
              {formatCurrency(netBalance)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{formatCurrency(totalIncome)}</span>
            <span className="text-rose-500 dark:text-rose-400 font-medium">-{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Atalhos da Secretaria & Administração
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={onOpenNewMemberModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Novo Membro</span>
          </button>

          <button
            onClick={onOpenNewEventModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <CalendarPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Novo Evento</span>
          </button>

          <button
            onClick={() => setActiveTab('escalas')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Escalas de Culto</span>
          </button>

          <button
            onClick={() => setActiveTab('membros')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Carteirinhas</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lançar Dízimo</span>
          </button>

          <button
            onClick={() => setActiveTab('relatorios')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all text-center group cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform font-bold"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Relatório Geral</span>
          </button>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Events & Sunday Duty */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sunday Duty Spotlight */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Escala do Próximo Domingo</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">25 de Outubro de 2026 • Culto de Celebração</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('escalas')}
                className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
                style={{ color: theme.primaryHex }}
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextDuty ? (
              <div className="mt-4 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">{nextDuty.serviceTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nextDuty.roles.map((r, idx) => {
                      const member = members.find(m => m.id === r.memberId);
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">{r.roleName}</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{member?.name || 'Não escalado'}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.confirmed ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'}`}>
                            {r.confirmed ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {nextDuty.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-1">
                    Nota da coordenação: {nextDuty.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhuma escala cadastrada.</p>
            )}
          </div>

          {/* Agenda & Cultos da Semana */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Próximos Cultos e Reuniões</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Programação oficial da igreja</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('calendario')}
                className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
                style={{ color: theme.primaryHex }}
              >
                <span>Calendário Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingEvents.map((evt) => {
                const dept = departments.find(d => d.id === evt.departmentId);
                return (
                  <div 
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-400">OUT</span>
                        <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{evt.startDate.split('-')[2]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{evt.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {evt.startTime} {evt.endTime && `às ${evt.endTime}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {evt.location}
                          </span>
                        </div>
                        {evt.speakerOrPreacher && (
                          <p 
                            className="text-[10px] font-semibold mt-1"
                            style={{ color: theme.primaryHex }}
                          >
                            Preletor: {evt.speakerOrPreacher}
                          </p>
                        )}
                      </div>
                    </div>
                    {dept && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {dept.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Birthdays & Quick Member Registry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aniversariantes do Mês com WhatsApp */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Aniversariantes de Outubro</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentMonthBirthdays.length} irmãos celebrando neste mês</p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {currentMonthBirthdays.map((m) => {
                const day = m.birthDate.split('-')[2];
                const cleanPhone = m.phone.replace(/\D/g, '');
                const msg = encodeURIComponent(
                  `A paz do Senhor, querido(a) ${m.name}! A liderança da ${churchProfile.name} deseja um feliz aniversário! Que o Senhor derrame ricas bênçãos sobre sua vida, saúde e família.`
                );

                return (
                  <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs"
                        style={{ 
                          backgroundColor: `${theme.primaryHex}20`,
                          color: theme.primaryHex 
                        }}
                      >
                        {day}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white leading-tight">{m.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedMemberForCard(m)}
                        title="Ver Carteirinha de Membro"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/55${cleanPhone}?text=${msg}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Enviar Parabéns no WhatsApp"
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Felicitar</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Últimos Membros Cadastrados */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Membros Recentes</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Últimos ingressos na congregação</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('membros')}
                className="text-xs font-semibold cursor-pointer"
                style={{ color: theme.primaryHex }}
              >
                Ver todos
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {members.slice(0, 4).map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setSelectedMemberForCard(m)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-xs text-slate-800 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.role} • {m.neighborhood || m.city}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'ativo' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  }`}>
                    {m.status === 'ativo' ? 'Ativo' : 'Em observação'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
