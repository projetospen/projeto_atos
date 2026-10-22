import React, { useState, useRef } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchProfile } from '../../types';
import { ChurchEmblemRenderer } from '../common/ChurchEmblemRenderer';
import { EmblemCustomizerModal } from '../common/EmblemCustomizerModal';
import { ThemeCustomizerModal } from '../common/ThemeCustomizerModal';
import { 
  Settings, 
  Church, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  ShieldCheck,
  CreditCard,
  Palette,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    churchProfile, 
    updateChurchProfile, 
    exportBackup, 
    importBackup, 
    resetAllData,
    members,
    departments,
    events,
    theme,
    colorMode,
    toggleColorMode 
  } = useChurch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ChurchProfile>(churchProfile);
  const [isEmblemModalOpen, setIsEmblemModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; success: boolean } | null>(null);

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
        {/* Left: Church Identity Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
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

              <button
                type="button"
                onClick={() => setIsEmblemModalOpen(true)}
                style={{
                  backgroundColor: theme.primaryHex,
                  color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0 hover:opacity-90"
              >
                <Palette className="w-4 h-4" />
                <span>Personalizar Emblema</span>
              </button>
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tema do Sistema</span>
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
                    Altere as cores de destaque e alterne entre modo claro ou escuro com fluidez em uma janela pop-up.
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
