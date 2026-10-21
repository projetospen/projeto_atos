import React, { useState, useRef } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchProfile } from '../../types';
import { ChurchEmblemRenderer } from '../common/ChurchEmblemRenderer';
import { EmblemCustomizerModal } from '../common/EmblemCustomizerModal';
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
  Sparkles
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
    events 
  } = useChurch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ChurchProfile>(churchProfile);
  const [isEmblemModalOpen, setIsEmblemModalOpen] = useState(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>Configurações da Igreja & Backup Geral</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dados cadastrais da congregação, liderança e segurança dos dados eclesiásticos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Church Identity Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Church className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-800 text-base">Identificação Oficial da Igreja</h3>
            </div>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvo com sucesso!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Emblem Customization Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
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
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Palette className="w-4 h-4" />
                <span>Personalizar Emblema</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Igreja / Ministério *</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtítulo / Congregação</label>
                <input
                  type="text"
                  value={profile.subtitle}
                  onChange={e => setProfile({ ...profile, subtitle: e.target.value })}
                  placeholder="Ex: Sede Central / Templo Sede"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pastor Presidente *</label>
                <input
                  type="text"
                  required
                  value={profile.seniorPastor}
                  onChange={e => setProfile({ ...profile, seniorPastor: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Secretária Eclesiástica</label>
                <input
                  type="text"
                  value={profile.secretaryName}
                  onChange={e => setProfile({ ...profile, secretaryName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tesoureiro Geral</label>
                <input
                  type="text"
                  value={profile.treasurerName}
                  onChange={e => setProfile({ ...profile, treasurerName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CNPJ da Igreja</label>
                <input
                  type="text"
                  value={profile.cnpj}
                  onChange={e => setProfile({ ...profile, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone da Secretaria</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail de Contato</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  placeholder="contato@igreja.org"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço do Templo</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Av. Esperança, 1250"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cidade / Estado / CEP</label>
                <input
                  type="text"
                  value={profile.cityState}
                  onChange={e => setProfile({ ...profile, cityState: e.target.value })}
                  placeholder="São Paulo - SP, CEP 03580-000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chave PIX da Igreja</label>
                <input
                  type="text"
                  value={profile.bankPixKey || ''}
                  onChange={e => setProfile({ ...profile, bankPixKey: e.target.value })}
                  placeholder="Chave CNPJ, e-mail ou telefone"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instagram da Igreja</label>
                <input
                  type="text"
                  value={profile.socialInstagram || ''}
                  onChange={e => setProfile({ ...profile, socialInstagram: e.target.value })}
                  placeholder="@suaigreja"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Versículo Lema da Igreja</label>
              <input
                type="text"
                value={profile.mottoVerse}
                onChange={e => setProfile({ ...profile, mottoVerse: e.target.value })}
                placeholder="Ex: Atos 2:42 - 'E perseveravam na doutrina...'"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Backup & Restauração de Dados</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Exporte todos os cadastros de membros, departamentos, eventos, escalas e finanças em um arquivo seguro JSON para guardar em seu computador ou nuvem.
            </p>

            <button
              onClick={exportBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Baixar Backup Completo (.JSON)</span>
            </button>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Restaurar de um Arquivo de Backup:</span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Selecionar Arquivo .JSON</span>
              </button>

              {importMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importMessage.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reset Demo Data Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Área de Redefinição</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deseja restaurar os dados de demonstração com todas as entidades e exemplos bíblicos padrão?
            </p>
            <button
              onClick={handleResetDefaults}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
    </div>
  );
};
