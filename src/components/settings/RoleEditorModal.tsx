import React, { useState, useEffect } from 'react';
import { 
  RoleDefinition, 
  NavTab, 
  ChurchModulesConfig, 
  PlatformTheme 
} from '../../types';
import { 
  X, 
  Crown, 
  ShieldCheck, 
  Users, 
  CircleDollarSign, 
  Building2, 
  BookOpen, 
  Video, 
  Music, 
  Heart, 
  Sparkles, 
  Star, 
  ClipboardList, 
  CalendarDays, 
  Mic,
  Check, 
  Lock,
  AlertCircle,
  Save,
  Shield,
  Layers
} from 'lucide-react';

interface RoleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit?: RoleDefinition | null;
  onSave: (roleData: Omit<RoleDefinition, 'id'>, roleId?: string) => void;
  theme: PlatformTheme;
  existingRoleNames?: string[];
}

const AVAILABLE_ICONS: { name: string; label: string; icon: React.ElementType }[] = [
  { name: 'Crown', label: 'Pastoral / Direção', icon: Crown },
  { name: 'ShieldCheck', label: 'Administração', icon: ShieldCheck },
  { name: 'Users', label: 'Secretaria / Membresia', icon: Users },
  { name: 'CircleDollarSign', label: 'Tesouraria / Finanças', icon: CircleDollarSign },
  { name: 'Building2', label: 'Departamentos', icon: Building2 },
  { name: 'BookOpen', label: 'EBD / Ensino', icon: BookOpen },
  { name: 'Video', label: 'Mídia / Transmissão', icon: Video },
  { name: 'Music', label: 'Louvor / Música', icon: Music },
  { name: 'Heart', label: 'Diaconia / Ação Social', icon: Heart },
  { name: 'Sparkles', label: 'Jovens / Conexão', icon: Sparkles },
  { name: 'Star', label: 'Kids / Infantil', icon: Star },
  { name: 'ClipboardList', label: 'Escalas / Obreiros', icon: ClipboardList },
  { name: 'CalendarDays', label: 'Eventos / Agenda', icon: CalendarDays },
  { name: 'Mic', label: 'Pregação / Recepção', icon: Mic },
];

const AVAILABLE_GRADIENTS: { id: string; label: string; class: string }[] = [
  { id: 'amber', label: 'Dourado / Âmbar', class: 'from-amber-500 to-amber-600' },
  { id: 'blue', label: 'Azul Celestial', class: 'from-blue-600 to-indigo-700' },
  { id: 'cyan', label: 'Turquesa / Ciano', class: 'from-cyan-600 to-teal-700' },
  { id: 'emerald', label: 'Esmeralda / Verde', class: 'from-emerald-600 to-green-700' },
  { id: 'purple', label: 'Púrpura Nobre', class: 'from-purple-600 to-indigo-700' },
  { id: 'orange', label: 'Laranja / Coral', class: 'from-orange-500 to-rose-600' },
  { id: 'rose', label: 'Rubi / Vinho', class: 'from-rose-600 to-red-700' },
  { id: 'slate', label: 'Grafite / Ônix', class: 'from-slate-700 to-slate-900' },
];

const TAB_OPTIONS: { id: NavTab; label: string }[] = [
  { id: 'dashboard', label: 'Visão Geral (Dashboard)' },
  { id: 'membros', label: 'Membros & Secretaria' },
  { id: 'departamentos', label: 'Departamentos & Ministérios' },
  { id: 'calendario', label: 'Calendário Eclesiástico' },
  { id: 'escalas', label: 'Escalas de Voluntários' },
  { id: 'financeiro', label: 'Tesouraria & Livro Caixa' },
  { id: 'relatorios', label: 'Relatórios Estatísticos' },
];

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({
  isOpen,
  onClose,
  roleToEdit,
  onSave,
  theme,
  existingRoleNames = [],
}) => {
  const isEditing = !!roleToEdit;

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [iconName, setIconName] = useState('Users');
  const [color, setColor] = useState('from-cyan-600 to-teal-700');
  const [isAdmin, setIsAdmin] = useState(false);
  const [defaultTab, setDefaultTab] = useState<NavTab>('membros');
  const [modules, setModules] = useState<ChurchModulesConfig>({
    financial: false,
    schedules: true,
    departments: true,
    events: true,
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (roleToEdit) {
        setName(roleToEdit.name);
        setSubtitle(roleToEdit.subtitle || '');
        setBadge(roleToEdit.badge || '');
        setIconName(roleToEdit.iconName || 'Users');
        setColor(roleToEdit.color || 'from-cyan-600 to-teal-700');
        setIsAdmin(!!roleToEdit.isAdmin);
        setDefaultTab(roleToEdit.defaultTab || 'membros');
        setModules({
          financial: roleToEdit.modules?.financial ?? false,
          schedules: roleToEdit.modules?.schedules ?? true,
          departments: roleToEdit.modules?.departments ?? true,
          events: roleToEdit.modules?.events ?? true,
        });
      } else {
        setName('');
        setSubtitle('');
        setBadge('');
        setIconName('Users');
        setColor('from-cyan-600 to-teal-700');
        setIsAdmin(false);
        setDefaultTab('membros');
        setModules({
          financial: false,
          schedules: true,
          departments: true,
          events: true,
        });
      }
      setErrorMessage('');
    }
  }, [isOpen, roleToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Por favor, informe um nome para o perfil.');
      return;
    }

    // Check for duplicate name if changed
    if (!isEditing || (roleToEdit && roleToEdit.name.toLowerCase() !== trimmedName.toLowerCase())) {
      const isDuplicate = existingRoleNames.some(
        n => n.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        setErrorMessage(`Já existe um perfil cadastrado com o nome "${trimmedName}".`);
        return;
      }
    }

    const roleData: Omit<RoleDefinition, 'id'> = {
      name: trimmedName,
      subtitle: subtitle.trim() || `Gestão e atribuições vinculadas a ${trimmedName}`,
      badge: badge.trim() || trimmedName.split(' ')[0],
      iconName,
      color,
      isAdmin,
      isSystem: roleToEdit?.isSystem ?? false,
      defaultTab,
      allowedTabs: isAdmin 
        ? (['dashboard', 'membros', 'departamentos', 'calendario', 'escalas', 'financeiro', 'relatorios', 'configuracoes'] as NavTab[])
        : (Array.from(new Set<NavTab>(['membros', defaultTab]))),
      modules: {
        financial: isAdmin ? true : !!modules.financial,
        schedules: isAdmin ? true : !!modules.schedules,
        departments: isAdmin ? true : !!modules.departments,
        events: isAdmin ? true : !!modules.events,
      }
    };

    onSave(roleData, roleToEdit?.id);
    onClose();
  };

  const SelectedIconComponent = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon || Users;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-fade-in my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br ${color}`}
            >
              <SelectedIconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                {isEditing ? `Editar Perfil de Acesso` : `Criar Novo Perfil de Acesso`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? `Altere o nome, ícone, privilégios e módulos permitidos` : `Configure as permissões e escopo da nova função eclesiástica`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nome do Perfil <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Pastor Auxiliar, Coordenação de Mídia..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Distintivo Curto (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="Ex: Pastoral, Comunicação"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Descrição / Atribuições da Função
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Descreva as principais atribuições e responsabilidades deste cargo na igreja..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Ícone Representativo do Perfil
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map(item => {
                const Icon = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    title={item.label}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-semibold truncate max-w-full text-center">
                      {item.label.split('/')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Gradient Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cor de Destaque do Perfil
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_GRADIENTS.map(grad => {
                const isSelected = color === grad.class;
                return (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => setColor(grad.class)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-800 dark:border-white ring-2 ring-slate-800/20 dark:ring-white/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${grad.class} shrink-0 shadow-xs flex items-center justify-center text-white`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {grad.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Administrative Role Switch */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                  Privilégio de Administrador Geral
                </h5>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed mt-0.5">
                  Concede acesso total à aba de <strong>Configurações</strong> da igreja, permitindo gerenciar cadastros oficiais, módulos do sistema e criar novos perfis de acesso.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer focus:outline-hidden ${
                isAdmin ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAdmin ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Start Tab */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Aba Inicial ao Realizar Login
            </label>
            <select
              value={defaultTab}
              onChange={e => setDefaultTab(e.target.value as NavTab)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
            >
              {TAB_OPTIONS.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Modules Availability for this role */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Módulos Ativos para este Perfil:
              </label>
              {isAdmin && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Liberado pelo status de administrador
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Membros (Permanent) */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-800 dark:text-white">Membros & Secretaria</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Base
                </span>
              </div>

              {/* Financeiro */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-white">Financeiro</span>
                </div>
                <button
                  type="button"
                  disabled={isAdmin}
                  role="switch"
                  aria-checked={isAdmin || !!modules.financial}
                  onClick={() => setModules(prev => ({ ...prev, financial: !prev.financial }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                    isAdmin || modules.financial ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    isAdmin || modules.financial ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Escalas */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-800 dark:text-white">Escalas</span>
                </div>
                <button
                  type="button"
                  disabled={isAdmin}
                  role="switch"
                  aria-checked={isAdmin || !!modules.schedules}
                  onClick={() => setModules(prev => ({ ...prev, schedules: !prev.schedules }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                    isAdmin || modules.schedules ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    isAdmin || modules.schedules ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Departamentos */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 dark:text-white">Departamentos</span>
                </div>
                <button
                  type="button"
                  disabled={isAdmin}
                  role="switch"
                  aria-checked={isAdmin || !!modules.departments}
                  onClick={() => setModules(prev => ({ ...prev, departments: !prev.departments }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                    isAdmin || modules.departments ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    isAdmin || modules.departments ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Calendário */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between sm:col-span-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-slate-800 dark:text-white">Calendário de Eventos & Cultos</span>
                </div>
                <button
                  type="button"
                  disabled={isAdmin}
                  role="switch"
                  aria-checked={isAdmin || !!modules.events}
                  onClick={() => setModules(prev => ({ ...prev, events: !prev.events }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                    isAdmin || modules.events ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    isAdmin || modules.events ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer hover:opacity-90"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
