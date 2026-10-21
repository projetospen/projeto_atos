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
    churchProfile 
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

  const formatDateBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Painel Administrativo Eclesiástico</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Graça e Paz, Administração!
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Gestão integrada da <span className="font-semibold text-amber-200">{churchProfile.name}</span>. Acompanhe a membresia, departamentos, escalas de culto deste final de semana e o fluxo da tesouraria.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewMemberModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Cadastro de Membro</span>
            </button>
            <button
              onClick={onOpenNewEventModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-amber-400" />
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
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none hidden sm:block" />
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div 
          onClick={() => setActiveTab('membros')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Membresia Total</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{members.length}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeMembers} ativos
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{inObservationMembers} em integração / visitantes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
          </p>
        </div>

        {/* Departments */}
        <div 
          onClick={() => setActiveTab('departamentos')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departamentos</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{departments.length}</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Ministérios Ativos
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Louvor, Kids, Diaconia, EBD...</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
          </p>
        </div>

        {/* Upcoming Events */}
        <div 
          onClick={() => setActiveTab('calendario')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eventos do Mês</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{events.length}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Cultos & Atividades
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{upcomingEvents.length} nos próximos 15 dias</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </p>
        </div>

        {/* Financial Net Balance */}
        <div 
          onClick={() => setActiveTab('financeiro')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balanço do Mês</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${netBalance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
              {formatCurrency(netBalance)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-medium">+{formatCurrency(totalIncome)}</span>
            <span className="text-rose-500 font-medium">-{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Atalhos da Secretaria & Administração
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={onOpenNewMemberModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/70 hover:border-indigo-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-900">Novo Membro</span>
          </button>

          <button
            onClick={onOpenNewEventModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/70 hover:border-emerald-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">Novo Evento</span>
          </button>

          <button
            onClick={() => setActiveTab('escalas')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/70 hover:border-amber-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-900">Escalas de Culto</span>
          </button>

          <button
            onClick={() => setActiveTab('membros')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/70 hover:border-purple-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-900">Carteirinhas</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-cyan-50/80 border border-slate-200/70 hover:border-cyan-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-cyan-900">Lançar Dízimo</span>
          </button>

          <button
            onClick={() => setActiveTab('relatorios')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-rose-50/80 border border-slate-200/70 hover:border-rose-200 transition-all text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-900">Relatório Geral</span>
          </button>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Events & Sunday Duty */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sunday Duty Spotlight */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Escala do Próximo Domingo</h3>
                  <p className="text-[11px] text-slate-500">25 de Outubro de 2026 • Culto de Celebração</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('escalas')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextDuty ? (
              <div className="mt-4 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-2">{nextDuty.serviceTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nextDuty.roles.map((r, idx) => {
                      const member = members.find(m => m.id === r.memberId);
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">{r.roleName}</span>
                            <span className="font-medium text-slate-800">{member?.name || 'Não escalado'}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.confirmed ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {nextDuty.notes && (
                  <p className="text-[11px] text-slate-500 italic px-1">
                    Nota da coordenação: {nextDuty.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhuma escala cadastrada.</p>
            )}
          </div>

          {/* Agenda & Cultos da Semana */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Próximos Cultos e Reuniões</h3>
                  <p className="text-[11px] text-slate-500">Programação oficial da igreja</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('calendario')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
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
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
                        <span className="text-[9px] uppercase font-bold text-slate-400">OUT</span>
                        <span className="text-sm font-black text-slate-800 leading-none">{evt.startDate.split('-')[2]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">{evt.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
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
                          <p className="text-[10px] text-amber-700 font-medium mt-1">
                            Preletor: {evt.speakerOrPreacher}
                          </p>
                        )}
                      </div>
                    </div>
                    {dept && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Aniversariantes de Outubro</h3>
                  <p className="text-[11px] text-slate-500">{currentMonthBirthdays.length} irmãos celebrando neste mês</p>
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
                  <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-200/60 text-amber-900 font-bold flex items-center justify-center text-xs">
                        {day}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{m.name}</p>
                        <p className="text-[10px] text-slate-500">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedMemberForCard(m)}
                        title="Ver Carteirinha de Membro"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Membros Recentes</h3>
                  <p className="text-[11px] text-slate-500">Últimos ingressos na congregação</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('membros')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {members.slice(0, 4).map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setSelectedMemberForCard(m)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.role} • {m.neighborhood || m.city}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
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
