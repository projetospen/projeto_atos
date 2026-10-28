import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { UserAccount, ROLE_PERMISSIONS } from '../../types';
import { getPlatformTheme } from '../../data/themeConfig';
import { ChurchEmblemRenderer } from '../common/ChurchEmblemRenderer';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogIn, 
  UserCheck, 
  Sparkles, 
  ChevronRight,
  Database,
  Building2,
  Palette
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { 
    churchProfile, 
    theme, 
    availableAccounts, 
    login, 
    isSupabaseConnected 
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'quick' | 'manual'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = async (account: UserAccount) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(account.email, undefined, account);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha no acesso. Verifique seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.primaryHex }}
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: theme.accentHex }}
      />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Church Identity Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <ChurchEmblemRenderer 
              emblem={churchProfile.emblem} 
              churchName={churchProfile.name}
              size="lg"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 mb-1">
              <span className="font-bold" style={{ color: theme.primaryHex }}>ATOS</span>
              <span>•</span>
              <span>Portal de Gestão Eclesiástica</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {churchProfile.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {churchProfile.subtitle || 'Sede Administrativa Central'}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setActiveTab('quick'); setErrorMessage(''); }}
              style={activeTab === 'quick' ? {
                backgroundColor: `${theme.primaryHex}20`,
                borderColor: theme.primaryHex,
                color: '#ffffff'
              } : undefined}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'quick'
                  ? 'border shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
              <span>Contas Oficiais</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('manual'); setErrorMessage(''); }}
              style={activeTab === 'manual' ? {
                backgroundColor: `${theme.primaryHex}20`,
                borderColor: theme.primaryHex,
                color: '#ffffff'
              } : undefined}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'manual'
                  ? 'border shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
              <span>Outra Conta</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: QUICK ACCESS ROLES */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Selecione seu perfil para acessar:
                </span>
                <span className="text-[10px] text-slate-500">Acesso Imediato</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-0.5">
                {availableAccounts.map(account => {
                  const permConfig = ROLE_PERMISSIONS[account.role];
                  const accountTheme = getPlatformTheme(account.themeId, {
                    primary: account.customPrimaryColor,
                    accent: account.customAccentColor,
                  });
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => handleQuickLogin(account)}
                      disabled={isLoading}
                      className="w-full p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all group cursor-pointer text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar with account's own individual theme color */}
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700/60 shadow-xs relative"
                          style={{ backgroundColor: `${accountTheme.primaryHex}25`, color: accountTheme.primaryHex }}
                        >
                          {account.name.split(' ')[1]?.charAt(0) || account.name.charAt(0)}
                          <span 
                            className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900" 
                            style={{ backgroundColor: accountTheme.primaryHex }}
                            title={`Paleta individual: ${accountTheme.name}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                            {account.name}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold" style={{ color: accountTheme.primaryHex }}>
                              {account.role}
                            </span>
                            <span>•</span>
                            <span className="truncate">{account.email}</span>
                          </p>
                          {/* Authorized Scope & Theme Pills */}
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800/80 font-medium">
                              {account.departmentName 
                                ? `${account.departmentName} & Calendário` 
                                : permConfig?.scopeLabel}
                            </span>
                            <span 
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1"
                              style={{
                                backgroundColor: `${accountTheme.primaryHex}15`,
                                color: accountTheme.primaryHex,
                                borderColor: `${accountTheme.primaryHex}30`
                              }}
                            >
                              <span>{account.colorMode === 'dark' ? '🌙' : '☀️'}</span>
                              <span>{accountTheme.name.split('&')[0].trim()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-800/60 group-hover:bg-slate-700 text-slate-400 group-hover:text-white transition-colors shrink-0 ml-2">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL LOGIN (ANOTHER ACCOUNT) */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <p className="text-xs text-slate-400">
                Informe os dados da sua conta para ingressar no painel administrativo:
              </p>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu.email@igreja.org"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  (Para contas locais sem senha cadastrada, basta informar o e-mail)
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: theme.primaryHex,
                  color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer hover:opacity-90 disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Entrando...' : 'Acessar Conta'}</span>
              </button>
            </form>
          )}

          {/* Database Connection Notice */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSupabaseConnected ? 'Conectado ao Banco Supabase' : 'Armazenamento Seguro Local'}</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Criptografia Ativa</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          ATOS Eclesiástico • {new Date().getFullYear()} • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};
