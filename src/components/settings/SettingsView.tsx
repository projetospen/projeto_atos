import React, { useState, useRef } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchProfile, ROLE_PERMISSIONS } from '../../types';
import { ChurchEmblemRenderer } from '../common/ChurchEmblemRenderer';
import { EmblemCustomizerModal } from '../common/EmblemCustomizerModal';
import { ThemeCustomizerModal } from '../common/ThemeCustomizerModal';
import { ModulePermissionsCustomizer } from './ModulePermissionsCustomizer';
import { 
  Settings, 
  Church, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  Palette,
  Camera,
  UserCheck,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    churchProfile, 
    updateChurchProfile, 
    toggleModule,
    toggleRoleModule,
    setRoleModules,
    resetRoleModules,
    isAdmin,
    uploadChurchIcon,
    exportBackup, 
    importBackup, 
    resetAllData,
    members,
    departments,
    events,
    theme,
    colorMode,
    toggleColorMode,
    currentUser,
    logout,
    updateCurrentUser
  } = useChurch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const churchIconFileInputRef = useRef<HTMLInputElement>(null);
  const userAvatarFileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ChurchProfile>(churchProfile);
  const [isEmblemModalOpen, setIsEmblemModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Device Church Icon Upload Handler
  const handleChurchIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      uploadChurchIcon(dataUrl);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Device Profile Photo Upload Handler
  const handleUserAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateCurrentUser({ avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Keep profile state synced with context
  React.useEffect(() => {
    setProfile(churchProfile);
  }, [churchProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateChurchProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importBackup(content);
      if (ok) {
        setImportMessage({ text: 'Backup restaurado com sucesso! Todos os dados foram atualizados.', success: true });
      } else {
        setImportMessage({ text: 'Falha ao restaurar backup. Verifique se o arquivo JSON é válido.', success: false });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados iniciais do sistema? Todas as alterações manuais serão resetadas.')) {
      resetAllData();
      alert('Dados padrão restaurados com sucesso.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" style={{ color: theme.primaryHex }} />
            <span>Configurações da Igreja & Identidade Visual</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dados cadastrais da congregação, liderança, cores institucionais, modo escuro e segurança
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Modules Customization & Church Identity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Personalização de Módulos & Permissões por Perfil */}
          <ModulePermissionsCustomizer
            churchProfile={churchProfile}
            theme={theme}
            isAdmin={isAdmin}
            toggleModule={toggleModule}
            toggleRoleModule={toggleRoleModule}
            setRoleModules={setRoleModules}
            resetRoleModules={resetRoleModules}
          />

          {/* Card 2: Identificação Oficial da Igreja */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Identificação Oficial da Igreja</h3>
              </div>
              {savedSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvo com sucesso!</span>
                </span>
              )}
            </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Emblem Customization Card */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${theme.bannerGradient} text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm`}>
              <div className="flex items-center gap-3.5">
                <ChurchEmblemRenderer
                  emblem={churchProfile.emblem}
                  churchName={churchProfile.name}
                  size="lg"
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Emblema Oficial</span>
                    <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">Barra Lateral & Carteirinhas</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{churchProfile.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    Símbolo configurado para a igreja na barra lateral e credenciais oficiais.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <input
                  type="file"
                  ref={churchIconFileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleChurchIconUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => churchIconFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Enviar imagem do seu dispositivo para ser o ícone/emblema oficial"
                >
                  <Upload className="w-4 h-4" />
                  <span>Ícone do Dispositivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEmblemModalOpen(true)}
                  style={{
                    backgroundColor: theme.primaryHex,
                    color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0 hover:opacity-90"
                >
                  <Palette className="w-4 h-4" />
                  <span>Personalizar Emblema</span>
                </button>
              </div>
            </div>

            {/* Platform Theme & Light/Dark Mode Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paleta do Perfil</span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${theme.primaryHex}20`, color: theme.primaryHex }}
                    >
                      {theme.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      {colorMode === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3 text-amber-500" />}
                      <span>Modo {colorMode === 'dark' ? 'Escuro' : 'Claro'}</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{theme.tagline}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    A paleta e o modo escuro são personalizados e salvos individualmente para o perfil de <strong>{currentUser?.name || 'seu usuário'}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleColorMode}
                  className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Alternar entre modo claro e escuro"
                >
                  {colorMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  <Palette className="w-4 h-4" />
                  <span>Personalizar Cores & Modo</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Nome da Igreja / Ministério *</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Subtítulo / Congregação</label>
                <input
                  type="text"
                  value={profile.subtitle}
                  onChange={e => setProfile({ ...profile, subtitle: e.target.value })}
                  placeholder="Ex: Sede Central / Templo Sede"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Pastor Presidente *</label>
                <input
                  type="text"
                  required
                  value={profile.seniorPastor}
                  onChange={e => setProfile({ ...profile, seniorPastor: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Secretária Eclesiástica</label>
                <input
                  type="text"
                  value={profile.secretaryName}
                  onChange={e => setProfile({ ...profile, secretaryName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Tesoureiro Geral</label>
                <input
                  type="text"
                  value={profile.treasurerName}
                  onChange={e => setProfile({ ...profile, treasurerName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">CNPJ da Instituição</label>
                <input
                  type="text"
                  value={profile.cnpj}
                  onChange={e => setProfile({ ...profile, cnpj: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">E-mail da Secretaria</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Endereço do Templo</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Cidade / UF</label>
                <input
                  type="text"
                  value={profile.cityState}
                  onChange={e => setProfile({ ...profile, cityState: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Chave PIX da Igreja</label>
                <input
                  type="text"
                  value={profile.bankPixKey || ''}
                  onChange={e => setProfile({ ...profile, bankPixKey: e.target.value })}
                  placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Instagram da Igreja</label>
                <input
                  type="text"
                  value={profile.socialInstagram || ''}
                  onChange={e => setProfile({ ...profile, socialInstagram: e.target.value })}
                  placeholder="@suaigreja"
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Versículo Lema da Igreja</label>
              <input
                type="text"
                value={profile.mottoVerse}
                onChange={e => setProfile({ ...profile, mottoVerse: e.target.value })}
                placeholder="Ex: Atos 2:42 - 'E perseveravam na doutrina...'"
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: theme.primaryHex }}
              >
                <Save className="w-4 h-4" />
                <span>Salvar Informações da Igreja</span>
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Right: Backup & System Maintenance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Backup Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5" style={{ color: theme.primaryHex }} />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Backup & Restauração de Dados</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exporte todos os cadastros de membros, departamentos, eventos, escalas e finanças em um arquivo seguro JSON para guardar em seu computador ou nuvem.
            </p>

            <button
              onClick={exportBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border border-slate-800 dark:border-slate-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Baixar Backup Completo (.JSON)</span>
            </button>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Restaurar de um Arquivo de Backup:</span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Selecionar Arquivo .JSON</span>
              </button>

              {importMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importMessage.success ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Account & Logout Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" style={{ color: theme.primaryHex }} />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                  Sessão & Conta Ativa
                </h4>
              </div>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${theme.primaryHex}20`, color: theme.primaryHex }}
              >
                Conectado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => userAvatarFileInputRef.current?.click()}
                  className="relative group/avatar cursor-pointer shrink-0"
                  title="Clique para carregar foto do perfil do seu dispositivo"
                >
                  {currentUser?.avatarUrl ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-xs relative">
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs relative"
                      style={{ backgroundColor: theme.primaryHex }}
                    >
                      {currentUser?.name.charAt(0) || 'U'}
                      <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs">
                    <Camera className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || churchProfile.seniorPastor}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email || 'admin@atos.org'}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                    Cargo: {currentUser?.role || 'Pastor Presidente'}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {ROLE_PERMISSIONS[currentUser?.role || 'Pastor Presidente']?.scopeLabel || 'Acesso Autorizado'}
                  </span>
                </div>
              </div>

              {/* Upload Profile Photo Button */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <input
                  type="file"
                  ref={userAvatarFileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUserAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => userAvatarFileInputRef.current?.click()}
                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                  <span>{currentUser?.avatarUrl ? 'Trocar Foto do Perfil' : 'Carregar Foto do Dispositivo'}</span>
                </button>
                {currentUser?.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => updateCurrentUser({ avatarUrl: undefined })}
                    className="py-1.5 px-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={() => logout()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta (Logout)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Ao sair, a tela de login será exibida para que outro usuário possa acessar o sistema.
            </p>
          </div>

          {/* Reset Demo Data Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Área de Redefinição</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Deseja restaurar os dados de demonstração com todas as entidades e exemplos bíblicos padrão?
            </p>
            <button
              onClick={handleResetDefaults}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Iniciais Demonstrativos</span>
            </button>
          </div>
        </div>
      </div>

      <EmblemCustomizerModal
        isOpen={isEmblemModalOpen}
        onClose={() => setIsEmblemModalOpen(false)}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
};
