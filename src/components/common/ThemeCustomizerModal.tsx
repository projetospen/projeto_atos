import React, { useState } from 'react';
import { PlatformThemeId, ColorMode } from '../../types';
import { platformThemes } from '../../data/themeConfig';
import { useChurch } from '../../context/ChurchContext';
import { 
  X, 
  Palette, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  Church, 
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Users,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    churchProfile, 
    theme, 
    setThemeId, 
    colorMode, 
    setColorMode 
  } = useChurch();

  const [customHex, setCustomHex] = useState(
    churchProfile.customPrimaryColor || theme.primaryHex || '#f59e0b'
  );
  const [showCustomPicker, setShowCustomPicker] = useState(
    churchProfile.themeId === 'personalizado'
  );

  if (!isOpen) return null;

  const currentThemeId = churchProfile.themeId || 'dourado_real';
  const themeList = Object.values(platformThemes);

  const handleSelectTheme = (id: PlatformThemeId) => {
    setShowCustomPicker(false);
    setThemeId(id);
  };

  const handleCustomColorChange = (newHex: string) => {
    setCustomHex(newHex);
    setThemeId('personalizado', { primary: newHex, accent: newHex });
  };

  const handleResetDefault = () => {
    setColorMode('light');
    setThemeId('dourado_real');
    setShowCustomPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto animate-fade-in transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-auto transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-all text-white font-bold"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">
                Personalização Visual da Igreja
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajuste cores institucionais e alterne entre modo claro e escuro para toda a plataforma
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar personalizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-7 max-h-[75vh] overflow-y-auto">
          
          {/* SECTION 1: MODO CLARO & ESCURO */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>1. Modo de Exibição</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Escolha como a plataforma deve ser exibida nos computadores e dispositivos da igreja
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Light Mode Card */}
              <div
                onClick={() => setColorMode('light')}
                className={`
                  p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between group
                  ${colorMode === 'light'
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs">
                      <Sun className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        Modo Claro
                      </h5>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Padrão diurno iluminado</span>
                    </div>
                  </div>

                  {colorMode === 'light' ? (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-3" />
                    </span>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>

                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Fundo branco suave</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">Alta nitidez</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Excelente para secretarias iluminadas e impressão de relatórios.</p>
                </div>
              </div>

              {/* Dark Mode Card */}
              <div
                onClick={() => setColorMode('dark')}
                className={`
                  p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between group
                  ${colorMode === 'dark'
                    ? 'border-indigo-600 bg-slate-900/60 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center font-bold shadow-xs">
                      <Moon className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        Modo Escuro
                      </h5>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Alto contraste e elegância</span>
                    </div>
                  </div>

                  {colorMode === 'dark' ? (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-3" />
                    </span>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>

                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-white">Tons escuros (Slate 950)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Pouca fadiga</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Ideal para projeção, cultos noturnos e conforto ocular contínuo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CORES INSTITUCIONAIS DA IGREJA */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>2. Cores Oficiais & Identidade da Igreja</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Todo o sistema (botões, barra lateral, badges e destaques) se adapta imediatamente à cor escolhida
                </p>
              </div>
            </div>

            {/* Presets Theme Grid with comfortable spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {themeList.map((t) => {
                const isSelected = currentThemeId === t.id && !showCustomPicker;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between group
                      ${isSelected 
                        ? 'border-indigo-600 bg-slate-50/90 dark:bg-slate-800/80 shadow-md ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/70'
                      }
                    `}
                  >
                    <div>
                      {/* Top Bar with color icon and radio */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 rounded-xl shadow-xs flex items-center justify-center font-bold text-white shrink-0"
                            style={{ backgroundColor: t.primaryHex }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
                            {t.name}
                          </span>
                        </div>

                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-3" />
                          </span>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.tagline}
                      </p>
                    </div>

                    {/* Color Swatches and status pill */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xs" 
                          style={{ backgroundColor: t.primaryHex }}
                          title="Tom Primário"
                        />
                        <div 
                          className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xs" 
                          style={{ backgroundColor: t.accentHex }}
                          title="Tom de Destaque"
                        />
                        <div 
                          className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-900 shadow-2xs" 
                          title="Fundo da Barra Lateral"
                        />
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isSelected ? 'Ativo' : 'Selecionar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CUSTOM HEX COLOR PICKER OPTION */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div 
                onClick={() => {
                  setShowCustomPicker(true);
                  handleCustomColorChange(customHex);
                }}
                className={`
                  p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3
                  ${showCustomPicker || currentThemeId === 'personalizado'
                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-slate-800/80 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: customHex }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Cor Personalizada da Igreja (HEX)</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Qualquer Cor
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Caso sua igreja utilize um código de cor exato do logotipo ou manual de marca
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center" onClick={e => e.stopPropagation()}>
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent"
                    title="Abrir seletor de cor"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="#2563eb"
                    className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl uppercase text-slate-800 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomPicker(true);
                      handleCustomColorChange(customHex);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      showCustomPicker ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRÉ-VISUALIZAÇÃO INTERATIVA EM TEMPO REAL */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>3. Demonstração em Tempo Real (Preview ao Vivo)</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Tema: <strong className="text-slate-700 dark:text-slate-200">{theme.name}</strong> • Modo: <strong className="text-slate-700 dark:text-slate-200">{colorMode === 'dark' ? 'Escuro' : 'Claro'}</strong>
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-all space-y-4">
              {/* Mock Header Row */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                    style={{ backgroundColor: theme.primaryHex }}
                  >
                    <Church className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white">{churchProfile.name}</p>
                    <p className="text-[10px] text-slate-400">Plataforma ATOS • Gestão Eclesiástica</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${theme.primaryHex}20`,
                      color: theme.primaryHex 
                    }}
                  >
                    Secretaria Ativa
                  </span>
                  <button 
                    type="button"
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                    style={{ backgroundColor: theme.primaryHex }}
                  >
                    + Novo Membro
                  </button>
                </div>
              </div>

              {/* Mock KPI & Badge Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Membros</span>
                  <p className="text-lg font-black text-slate-800 dark:text-white mt-0.5">342</p>
                  <span 
                    className="text-[10px] font-semibold flex items-center gap-1 mt-1"
                    style={{ color: theme.primaryHex }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    94% em comunhão
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Departamentos</span>
                  <p className="text-lg font-black text-slate-800 dark:text-white mt-0.5">8 Ministérios</p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Escalas ativas</span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Próximo Culto</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5 truncate">Domingo 19:00</p>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-1"
                    style={{ 
                      backgroundColor: `${theme.primaryHex}15`, 
                      color: theme.primaryHex 
                    }}
                  >
                    Culto da Família
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: theme.primaryHex }}
          >
            Concluir & Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
