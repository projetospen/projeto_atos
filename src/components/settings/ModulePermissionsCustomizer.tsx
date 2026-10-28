import React, { useState } from 'react';
import { 
  ChurchProfile, 
  ChurchModulesConfig, 
  AdminRole, 
  DEFAULT_CHURCH_MODULES, 
  DEFAULT_ROLE_MODULES,
  PlatformTheme,
  isAdminRole
} from '../../types';
import { 
  Boxes, 
  Users, 
  Building2, 
  CircleDollarSign, 
  ClipboardList, 
  CalendarDays, 
  Lock, 
  CheckCircle2, 
  Info, 
  Crown, 
  Table, 
  Layers, 
  RotateCcw, 
  Check, 
  ShieldCheck,
  ShieldAlert,
  CheckCheck,
  Unlock
} from 'lucide-react';

interface ModulePermissionsCustomizerProps {
  churchProfile: ChurchProfile;
  theme: PlatformTheme;
  isAdmin: boolean;
  toggleModule: (moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => void;
  toggleRoleModule: (role: AdminRole, moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => void;
  setRoleModules: (role: AdminRole, modules: ChurchModulesConfig) => void;
  resetRoleModules: (role?: AdminRole) => void;
}

const ALL_ROLES: AdminRole[] = [
  'Pastor Presidente',
  'Administrador Geral',
  'Secretaria Eclesiástica',
  'Tesouraria',
  'Líder de Ministério'
];

const ROLE_DETAILS: Record<AdminRole, { title: string; subtitle: string; icon: React.ElementType; badge: string; color: string }> = {
  'Pastor Presidente': {
    title: 'Pastor Presidente',
    subtitle: 'Direção Geral, Conselho Pastoral e Gestão Ministerial Plena (Acesso Total)',
    icon: Crown,
    badge: 'Liderança Pastoral',
    color: 'from-amber-500 to-amber-600',
  },
  'Administrador Geral': {
    title: 'Administrador Geral',
    subtitle: 'Gestão Completa da Plataforma, Módulos, Segurança e Cadastros (Acesso Total)',
    icon: ShieldCheck,
    badge: 'Administração Geral',
    color: 'from-blue-600 to-indigo-700',
  },
  'Secretaria Eclesiástica': {
    title: 'Secretaria Eclesiástica',
    subtitle: 'Cadastro Geral de Membros, Fichas de Batismo, Atas e Carteirinhas',
    icon: Users,
    badge: 'Secretaria & Membresia',
    color: 'from-cyan-600 to-teal-700',
  },
  'Tesouraria': {
    title: 'Tesouraria',
    subtitle: 'Entradas de Dízimos, Ofertas, Saídas, Livro Caixa e Relatórios',
    icon: CircleDollarSign,
    badge: 'Gestão Contábil',
    color: 'from-emerald-600 to-green-700',
  },
  'Líder de Ministério': {
    title: 'Líder de Ministério',
    subtitle: 'Gestão Departamental (Louvor, Diaconia, Jovens, Kids, Mídia...)',
    icon: Building2,
    badge: 'Coordenação Departamental',
    color: 'from-orange-500 to-rose-600',
  },
};

export const ModulePermissionsCustomizer: React.FC<ModulePermissionsCustomizerProps> = ({
  churchProfile,
  theme,
  isAdmin,
  toggleModule,
  toggleRoleModule,
  setRoleModules,
  resetRoleModules,
}) => {
  const [subTab, setSubTab] = useState<'per_profile' | 'church_wide'>('per_profile');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Secretaria Eclesiástica');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const enabledModules = churchProfile.enabledModules || DEFAULT_CHURCH_MODULES;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const getRoleModules = (role: AdminRole): ChurchModulesConfig => {
    return churchProfile.roleModulesConfig?.[role] || DEFAULT_ROLE_MODULES[role] || {
      financial: true,
      schedules: true,
      departments: true,
      events: true,
    };
  };

  const handleToggleChurchModule = (moduleKey: keyof ChurchModulesConfig) => {
    if (!isAdmin) return;
    const currentVal = enabledModules[moduleKey] !== false;
    toggleModule(moduleKey, !currentVal);
    showFeedback(
      !currentVal 
        ? `Módulo ativado globalmente na igreja` 
        : `Módulo desativado globalmente na igreja`
    );
  };

  const handleToggleRoleModule = (role: AdminRole, moduleKey: keyof ChurchModulesConfig) => {
    if (!isAdmin) return;
    const roleMods = getRoleModules(role);
    const nextVal = !roleMods[moduleKey];
    toggleRoleModule(role, moduleKey, nextVal);
    showFeedback(`Módulo atualizado para o perfil "${role}"`);
  };

  const handleSetAllForRole = (role: AdminRole, enable: boolean) => {
    if (!isAdmin) return;
    setRoleModules(role, {
      financial: enable,
      schedules: enable,
      departments: enable,
      events: enable,
    });
    showFeedback(enable ? `Todos os módulos liberados para "${role}"` : `Módulos opcionais bloqueados para "${role}"`);
  };

  const handleSetAllRoles = (enable: boolean) => {
    if (!isAdmin) return;
    ALL_ROLES.forEach(r => {
      setRoleModules(r, {
        financial: enable,
        schedules: enable,
        departments: enable,
        events: enable,
      });
    });
    showFeedback(enable ? 'Todos os módulos liberados para TODOS os 5 perfis!' : 'Módulos opcionais bloqueados para todos os perfis!');
  };

  const handleSetAllChurchModules = (enable: boolean) => {
    if (!isAdmin) return;
    (['financial', 'schedules', 'departments', 'events'] as (keyof ChurchModulesConfig)[]).forEach(k => {
      toggleModule(k, enable);
    });
    showFeedback(enable ? 'Todos os módulos foram liberados na congregação!' : 'Módulos opcionais foram bloqueados na congregação!');
  };

  const handleResetRole = (role: AdminRole) => {
    if (!isAdmin) return;
    resetRoleModules(role);
    showFeedback(`Permissões restauradas para o padrão de "${role}"`);
  };

  const handleResetAll = () => {
    if (!isAdmin) return;
    if (window.confirm('Tem certeza que deseja restaurar as permissões de módulos padrão de TODOS os perfis de acesso?')) {
      resetRoleModules();
      showFeedback('Todos os perfis foram restaurados para a configuração padrão.');
    }
  };

  const activeModulesCount = [
    true,
    enabledModules.financial !== false,
    enabledModules.schedules !== false,
    enabledModules.departments !== false,
    enabledModules.events !== false,
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0"
            style={{ backgroundColor: `${theme.primaryHex}20`, color: theme.primaryHex }}
          >
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
              <span>Personalização de Módulos & Acesso</span>
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Admin
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Defina quais ferramentas estão disponíveis para cada perfil de usuário ou para toda a congregação
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setSubTab('per_profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'per_profile'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            style={subTab === 'per_profile' ? { color: theme.primaryHex } : undefined}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Por Perfil de Usuário</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('church_wide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'church_wide'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            style={subTab === 'church_wide' ? { color: theme.primaryHex } : undefined}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Geral da Igreja ({activeModulesCount}/5)</span>
          </button>
        </div>
      </div>

      {/* Floating feedback message */}
      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Salvo instantaneamente</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. Módulos por Perfil de Usuário                                          */}
      {/* ========================================================================= */}
      {subTab === 'per_profile' && (
        <div className="space-y-5">
          {/* Status info bar */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            isAdmin 
              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}>
            {isAdmin ? (
              <Crown className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.primaryHex }} />
            ) : (
              <Lock className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            )}
            <div className="flex-1">
              {isAdmin ? (
                <p>
                  <strong>Gestão de Permissões por Perfil:</strong> Como administrador, defina quais ferramentas cada perfil de acesso pode visualizar e utilizar. As alterações entram em vigor imediatamente para todos os usuários desse perfil.
                </p>
              ) : (
                <p>
                  <strong>Visualização de Leitura:</strong> Apenas administradores do sistema e o Pastor Presidente possuem permissão para modificar as permissões dos perfis.
                </p>
              )}
            </div>

            {/* View Mode Toggle: Cards vs Matrix */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Visão detalhada por perfil"
                className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                title="Matriz comparativa de todos os perfis"
                className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'matrix' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MODE A: Profile Details Card */}
          {viewMode === 'cards' && (
            <div className="space-y-4">
              {/* Role Selector Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {ALL_ROLES.map((roleKey) => {
                  const meta = ROLE_DETAILS[roleKey];
                  const roleMods = getRoleModules(roleKey);
                  const roleActiveCount = [
                    true, // Membros
                    roleMods.financial !== false && enabledModules.financial !== false,
                    roleMods.schedules !== false && enabledModules.schedules !== false,
                    roleMods.departments !== false && enabledModules.departments !== false,
                    roleMods.events !== false && enabledModules.events !== false,
                  ].filter(Boolean).length;
                  const isSelected = selectedRole === roleKey;
                  const Icon = meta.icon;

                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => setSelectedRole(roleKey)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 shadow-md ring-2'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      style={isSelected ? { 
                        borderColor: theme.primaryHex,
                        boxShadow: `0 0 0 2px ${theme.primaryHex}40`
                      } : undefined}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                          style={{ 
                            backgroundColor: isSelected ? `${theme.primaryHex}25` : undefined,
                            color: isSelected ? theme.primaryHex : undefined
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {roleActiveCount}/5
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-white leading-tight">
                          {roleKey}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                          {meta.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Role Actions & Module Switch List */}
              {(() => {
                const meta = ROLE_DETAILS[selectedRole];
                const roleMods = getRoleModules(selectedRole);
                const Icon = meta.icon;

                return (
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5 shadow-xs">
                    {/* Role Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: `${theme.primaryHex}20`, color: theme.primaryHex }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-base text-slate-800 dark:text-white">
                              Perfil: {selectedRole}
                            </h4>
                            <span 
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                            >
                              {meta.badge}
                            </span>
                            {isAdminRole(selectedRole) && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Acesso Total Permanente
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {meta.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleSetAllForRole(selectedRole, true)}
                            title="Ativar todos os módulos para este perfil"
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Liberar Todos</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetAllForRole(selectedRole, false)}
                            title="Bloquear todos os módulos opcionais para este perfil"
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Bloquear Todos</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetRole(selectedRole)}
                            title="Restaurar padrão deste perfil"
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Padrão</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Admin Profile Full-Access Guaranteed Banner */}
                    {isAdminRole(selectedRole) && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                        <Crown className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div className="leading-relaxed">
                          <strong>Acesso Total Irrestrito:</strong> O <strong>{selectedRole}</strong> possui acesso permanente a todos os módulos do sistema (Membros, Financeiro, Escalas, Departamentos, Eventos e Configurações). As opções abaixo permitem aos administradores personalizar e alternar módulos livremente para testes e configurações da igreja.
                        </div>
                      </div>
                    )}

                    {/* Switch Modules List */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* 1. Membros (Permanent) */}
                      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                          >
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                                Módulo de Membros & Secretaria
                              </h5>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-slate-500" />
                                Sempre Ativo • Base
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Acesso à membresia, cadastro, carteirinhas com QR Code e aniversariantes.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ativo para {selectedRole}
                          </span>
                        </div>
                      </div>

                      {/* 2. Financeiro */}
                      {(() => {
                        const isGloballyDisabled = enabledModules.financial === false;
                        const isRoleActive = isAdminRole(selectedRole) || (roleMods.financial !== false && !isGloballyDisabled);

                        return (
                          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CircleDollarSign className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                                    Módulo Financeiro (Dízimos e Despesas)
                                  </h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isRoleActive
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                  }`}>
                                    {isRoleActive ? `Ativo para ${selectedRole}` : `Oculto para ${selectedRole}`}
                                  </span>
                                  {isGloballyDisabled && !isAdminRole(selectedRole) && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      Desativado no master geral da igreja
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Permite a este perfil visualizar e gerenciar o Livro Caixa, entradas de dízimos/ofertas e despesas.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                role="switch"
                                disabled={!isAdmin}
                                aria-checked={roleMods.financial !== false}
                                onClick={() => handleToggleRoleModule(selectedRole, 'financial')}
                                title={!isAdmin ? 'Apenas administradores podem alterar' : 'Alternar módulo financeiro para este perfil'}
                                className={`
                                  relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                                  transition-colors duration-200 ease-in-out focus:outline-hidden
                                  ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  ${roleMods.financial !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                                style={roleMods.financial !== false ? { backgroundColor: theme.primaryHex } : undefined}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`
                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                                    transition duration-200 ease-in-out
                                    ${roleMods.financial !== false ? 'translate-x-5' : 'translate-x-0'}
                                  `}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                      {/* 3. Escalas */}
                      {(() => {
                        const isGloballyDisabled = enabledModules.schedules === false;
                        const isRoleActive = isAdminRole(selectedRole) || (roleMods.schedules !== false && !isGloballyDisabled);

                        return (
                          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <ClipboardList className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                                    Módulo de Escalas de Voluntários
                                  </h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isRoleActive
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                  }`}>
                                    {isRoleActive ? `Ativo para ${selectedRole}` : `Oculto para ${selectedRole}`}
                                  </span>
                                  {isGloballyDisabled && !isAdminRole(selectedRole) && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      Desativado no master geral da igreja
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Permite a este perfil planejar escalas de culto, organizar voluntários e acompanhar confirmações.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                role="switch"
                                disabled={!isAdmin}
                                aria-checked={roleMods.schedules !== false}
                                onClick={() => handleToggleRoleModule(selectedRole, 'schedules')}
                                title={!isAdmin ? 'Apenas administradores podem alterar' : 'Alternar módulo de escalas para este perfil'}
                                className={`
                                  relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                                  transition-colors duration-200 ease-in-out focus:outline-hidden
                                  ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  ${roleMods.schedules !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                                style={roleMods.schedules !== false ? { backgroundColor: theme.primaryHex } : undefined}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`
                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                                    transition duration-200 ease-in-out
                                    ${roleMods.schedules !== false ? 'translate-x-5' : 'translate-x-0'}
                                  `}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 4. Departamentos */}
                      {(() => {
                        const isGloballyDisabled = enabledModules.departments === false;
                        const isRoleActive = isAdminRole(selectedRole) || (roleMods.departments !== false && !isGloballyDisabled);

                        return (
                          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                                    Módulo de Departamentos e Ministérios
                                  </h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isRoleActive
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                  }`}>
                                    {isRoleActive ? `Ativo para ${selectedRole}` : `Oculto para ${selectedRole}`}
                                  </span>
                                  {isGloballyDisabled && !isAdminRole(selectedRole) && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      Desativado no master geral da igreja
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Coordenação de ministérios (Louvor, Diaconia, EBD, Mídia, Kids), metas, líderes e orçamentos.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                role="switch"
                                disabled={!isAdmin}
                                aria-checked={roleMods.departments !== false}
                                onClick={() => handleToggleRoleModule(selectedRole, 'departments')}
                                title={!isAdmin ? 'Apenas administradores podem alterar' : 'Alternar módulo de departamentos para este perfil'}
                                className={`
                                  relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                                  transition-colors duration-200 ease-in-out focus:outline-hidden
                                  ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  ${roleMods.departments !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                                style={roleMods.departments !== false ? { backgroundColor: theme.primaryHex } : undefined}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`
                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                                    transition duration-200 ease-in-out
                                    ${roleMods.departments !== false ? 'translate-x-5' : 'translate-x-0'}
                                  `}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 5. Calendário */}
                      {(() => {
                        const isGloballyDisabled = enabledModules.events === false;
                        const isRoleActive = isAdminRole(selectedRole) || (roleMods.events !== false && !isGloballyDisabled);

                        return (
                          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <CalendarDays className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <h5 className="font-bold text-sm text-slate-800 dark:text-white">
                                    Módulo de Calendário de Eventos
                                  </h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isRoleActive
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                  }`}>
                                    {isRoleActive ? `Ativo para ${selectedRole}` : `Oculto para ${selectedRole}`}
                                  </span>
                                  {isGloballyDisabled && !isAdminRole(selectedRole) && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      Desativado no master geral da igreja
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Acesso à agenda de cultos oficiais, eventos da igreja, vigílias, ensaios e reuniões de liderança.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                role="switch"
                                disabled={!isAdmin}
                                aria-checked={roleMods.events !== false}
                                onClick={() => handleToggleRoleModule(selectedRole, 'events')}
                                title={!isAdmin ? 'Apenas administradores podem alterar' : 'Alternar módulo de calendário para este perfil'}
                                className={`
                                  relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                                  transition-colors duration-200 ease-in-out focus:outline-hidden
                                  ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  ${roleMods.events !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                                style={roleMods.events !== false ? { backgroundColor: theme.primaryHex } : undefined}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`
                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                                    transition duration-200 ease-in-out
                                    ${roleMods.events !== false ? 'translate-x-5' : 'translate-x-0'}
                                  `}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* MODE B: Full Matrix Table */}
          {viewMode === 'matrix' && (
            <div className="space-y-4">
              {/* Matrix Top Bulk Actions */}
              {isAdmin && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Ações Rápidas para Todos os 5 Perfis:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSetAllRoles(true)}
                      title="Ativar todos os módulos para todos os 5 perfis"
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Liberar Tudo (Todos os Perfis)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllRoles(false)}
                      title="Bloquear módulos opcionais para todos os perfis"
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bloquear Opcionais (Todos)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAll}
                      title="Restaurar padrão canônico de todos os perfis"
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrão Geral</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5 pl-4">Perfil de Acesso</th>
                      <th className="p-3.5 text-center">Membros</th>
                      <th className="p-3.5 text-center">Financeiro</th>
                      <th className="p-3.5 text-center">Escalas</th>
                      <th className="p-3.5 text-center">Departamentos</th>
                      <th className="p-3.5 text-center">Calendário</th>
                      {isAdmin && <th className="p-3.5 text-center">Ações</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                    {ALL_ROLES.map((roleKey) => {
                      const meta = ROLE_DETAILS[roleKey];
                      const roleMods = getRoleModules(roleKey);
                      const Icon = meta.icon;
                      const isRoleAdmin = isAdminRole(roleKey);

                      return (
                        <tr key={roleKey} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 pl-4">
                            <div className="flex items-center gap-2.5">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0"
                                style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-slate-800 dark:text-white leading-tight">
                                    {roleKey}
                                  </p>
                                  {isRoleAdmin && (
                                    <span title="Acesso Total Garantido" className="inline-flex">
                                      <Crown className="w-3 h-3 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {meta.badge}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Membros (Permanent) */}
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              <Lock className="w-2.5 h-2.5" />
                              Ativo
                            </span>
                          </td>

                          {/* Financeiro */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              disabled={!isAdmin}
                              onClick={() => handleToggleRoleModule(roleKey, 'financial')}
                              title={!isAdmin ? 'Apenas admin pode alterar' : `Alternar Financeiro para ${roleKey}`}
                              className={`
                                relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent 
                                transition-colors duration-200 ease-in-out focus:outline-hidden
                                ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${roleMods.financial !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                              `}
                              style={roleMods.financial !== false ? { backgroundColor: theme.primaryHex } : undefined}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs
                                  transition duration-200 ease-in-out
                                  ${roleMods.financial !== false ? 'translate-x-4' : 'translate-x-0'}
                                `}
                              />
                            </button>
                          </td>

                          {/* Escalas */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              disabled={!isAdmin}
                              onClick={() => handleToggleRoleModule(roleKey, 'schedules')}
                              title={!isAdmin ? 'Apenas admin pode alterar' : `Alternar Escalas para ${roleKey}`}
                              className={`
                                relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent 
                                transition-colors duration-200 ease-in-out focus:outline-hidden
                                ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${roleMods.schedules !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                              `}
                              style={roleMods.schedules !== false ? { backgroundColor: theme.primaryHex } : undefined}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs
                                  transition duration-200 ease-in-out
                                  ${roleMods.schedules !== false ? 'translate-x-4' : 'translate-x-0'}
                                `}
                              />
                            </button>
                          </td>

                          {/* Departamentos */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              disabled={!isAdmin}
                              onClick={() => handleToggleRoleModule(roleKey, 'departments')}
                              title={!isAdmin ? 'Apenas admin pode alterar' : `Alternar Departamentos para ${roleKey}`}
                              className={`
                                relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent 
                                transition-colors duration-200 ease-in-out focus:outline-hidden
                                ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${roleMods.departments !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                              `}
                              style={roleMods.departments !== false ? { backgroundColor: theme.primaryHex } : undefined}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs
                                  transition duration-200 ease-in-out
                                  ${roleMods.departments !== false ? 'translate-x-4' : 'translate-x-0'}
                                `}
                              />
                            </button>
                          </td>

                          {/* Calendário */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              disabled={!isAdmin}
                              onClick={() => handleToggleRoleModule(roleKey, 'events')}
                              title={!isAdmin ? 'Apenas admin pode alterar' : `Alternar Calendário para ${roleKey}`}
                              className={`
                                relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent 
                                transition-colors duration-200 ease-in-out focus:outline-hidden
                                ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${roleMods.events !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                              `}
                              style={roleMods.events !== false ? { backgroundColor: theme.primaryHex } : undefined}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs
                                  transition duration-200 ease-in-out
                                  ${roleMods.events !== false ? 'translate-x-4' : 'translate-x-0'}
                                `}
                              />
                            </button>
                          </td>

                          {/* Ações */}
                          {isAdmin && (
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleResetRole(roleKey)}
                                title="Restaurar padrão deste perfil"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Módulos Gerais da Congregação (Master Switches)                        */}
      {/* ========================================================================= */}
      {subTab === 'church_wide' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Building2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.primaryHex }} />
            <p className="leading-relaxed">
              <strong>Chaves Mestres da Igreja:</strong> Ao desativar um módulo aqui, ele será desligado em todo o sistema para os membros e perfis operacionais da congregação. Use esta seção se a sua igreja não utiliza determinada ferramenta.
            </p>
          </div>

          {/* Church Wide Bulk Actions */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Ações Rápidas Globais da Igreja:
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSetAllChurchModules(true)}
                  title="Ativar todos os módulos em toda a congregação"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Liberar Todos na Igreja</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAllChurchModules(false)}
                  title="Bloquear todos os módulos opcionais na igreja"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Todos na Igreja</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {/* 1. Módulo de Membros & Secretaria (Permanent) */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Módulo de Membros & Secretaria
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <Lock className="w-3 h-3 text-slate-500" />
                      Sempre Ativo • Base do Sistema
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Cadastro geral de fiéis e visitantes, fichas cadastrais, batismos, aniversariantes do mês e emissão de carteirinhas digitais com QR Code.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Permanente
                </span>
              </div>
            </div>

            {/* 2. Módulo Financeiro */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Módulo Financeiro (Dízimos e Despesas)
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enabledModules.financial !== false
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {enabledModules.financial !== false ? 'Ativo na Igreja' : 'Desativado Globalmente'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Gestão de dízimos, ofertas congregacionais e missionárias, controle de despesas e contas a pagar, balanço mensal e recibos eclesiásticos.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  role="switch"
                  disabled={!isAdmin}
                  aria-checked={enabledModules.financial !== false}
                  onClick={() => handleToggleChurchModule('financial')}
                  title={!isAdmin ? 'Apenas administradores podem alterar' : enabledModules.financial !== false ? 'Clique para ocultar módulo financeiro' : 'Clique para ativar módulo financeiro'}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-hidden
                    ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${enabledModules.financial !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                  `}
                  style={enabledModules.financial !== false ? { backgroundColor: theme.primaryHex } : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                      transition duration-200 ease-in-out
                      ${enabledModules.financial !== false ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* 3. Módulo de Escalas de Voluntários */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Módulo de Escalas de Voluntários
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enabledModules.schedules !== false
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {enabledModules.schedules !== false ? 'Ativo na Igreja' : 'Desativado Globalmente'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Escalação de obreiros, equipes de louvor, diaconia, recepção de culto, sonoplastia e mídia com confirmação de presença em tempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  role="switch"
                  disabled={!isAdmin}
                  aria-checked={enabledModules.schedules !== false}
                  onClick={() => handleToggleChurchModule('schedules')}
                  title={!isAdmin ? 'Apenas administradores podem alterar' : enabledModules.schedules !== false ? 'Clique para ocultar módulo de escalas' : 'Clique para ativar módulo de escalas'}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-hidden
                    ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${enabledModules.schedules !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                  `}
                  style={enabledModules.schedules !== false ? { backgroundColor: theme.primaryHex } : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                      transition duration-200 ease-in-out
                      ${enabledModules.schedules !== false ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* 4. Módulo de Departamentos e Ministérios */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Módulo de Departamentos e Ministérios
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enabledModules.departments !== false
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {enabledModules.departments !== false ? 'Ativo na Igreja' : 'Desativado Globalmente'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Organização por áreas de atuação da congregação: Ministério de Louvor, Diaconia, Rede de Jovens, Ministério Infantil, EBD, Mídia & Tecnologia.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  role="switch"
                  disabled={!isAdmin}
                  aria-checked={enabledModules.departments !== false}
                  onClick={() => handleToggleChurchModule('departments')}
                  title={!isAdmin ? 'Apenas administradores podem alterar' : enabledModules.departments !== false ? 'Clique para ocultar módulo de departamentos' : 'Clique para ativar módulo de departamentos'}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-hidden
                    ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${enabledModules.departments !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                  `}
                  style={enabledModules.departments !== false ? { backgroundColor: theme.primaryHex } : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                      transition duration-200 ease-in-out
                      ${enabledModules.departments !== false ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* 5. Módulo de Calendário de Eventos */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Módulo de Calendário de Eventos
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enabledModules.events !== false
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {enabledModules.events !== false ? 'Ativo na Igreja' : 'Desativado Globalmente'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Cronograma e agenda geral da congregação: cultos semanais, cultos de oração, Santa Ceia, batismos, congressos e reuniões de liderança.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  role="switch"
                  disabled={!isAdmin}
                  aria-checked={enabledModules.events !== false}
                  onClick={() => handleToggleChurchModule('events')}
                  title={!isAdmin ? 'Apenas administradores podem alterar' : enabledModules.events !== false ? 'Clique para ocultar módulo de calendário' : 'Clique para ativar módulo de calendário'}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-hidden
                    ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${enabledModules.events !== false ? '' : 'bg-slate-300 dark:bg-slate-700'}
                  `}
                  style={enabledModules.events !== false ? { backgroundColor: theme.primaryHex } : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 
                      transition duration-200 ease-in-out
                      ${enabledModules.events !== false ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tip Note */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong>Sincronização Imediata:</strong> As permissões definidas pelo administrador entram em vigor instantaneamente. Usuários logados com seus perfis verão apenas as abas e ferramentas autorizadas para a sua função eclesiástica.
        </p>
      </div>
    </div>
  );
};
