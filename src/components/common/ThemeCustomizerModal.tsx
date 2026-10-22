import React, { useState } from 'react';
import { PlatformThemeId, ColorMode } from '../../types';
import { platformThemes, getPlatformTheme } from '../../data/themeConfig';
import { useChurch } from '../../context/ChurchContext';
import { ChurchEmblemRenderer } from './ChurchEmblemRenderer';
import { 
  X, 
  Palette, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  RotateCcw,
  Save,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
}) => {
  const { 
    churchProfile, 
    theme, 
    setThemeId, 
    colorMode, 
    setColorMode,
    isThemeModalOpen,
    closeThemeModal
  } = useChurch();

  const isModalOpen = propsIsOpen !== undefined ? propsIsOpen : isThemeModalOpen;
  const handleClose = propsOnClose || closeThemeModal;

  const [activeThemeId, setActiveThemeId] = useState<PlatformThemeId>(
    churchProfile.themeId || 'dourado_real'
  );
  const [activeColorMode, setActiveColorMode] = useState<ColorMode>(
    colorMode || 'light'
  );
  const [customHex, setCustomHex] = useState(
    churchProfile.customPrimaryColor || theme.primaryHex || '#f59e0b'
  );
  const [isCustomMode, setIsCustomMode] = useState(
    churchProfile.themeId === 'personalizado'
  );

  // Sync state whenever modal opens or churchProfile updates
  React.useEffect(() => {
    if (isModalOpen) {
      setActiveThemeId(churchProfile.themeId || 'dourado_real');
      setActiveColorMode(colorMode || 'light');
      setCustomHex(churchProfile.customPrimaryColor || theme.primaryHex || '#f59e0b');
      setIsCustomMode(churchProfile.themeId === 'personalizado');
    }
  }, [isModalOpen, churchProfile, colorMode, theme]);

  if (!isModalOpen) return null;

  const currentComputedTheme = isCustomMode 
    ? getPlatformTheme('personalizado', { primary: customHex, accent: customHex })
    : getPlatformTheme(activeThemeId);

  const previewPrimaryHex = isCustomMode ? customHex : currentComputedTheme.primaryHex;

  const handleSelectPresetTheme = (id: PlatformThemeId) => {
    setIsCustomMode(false);
    setActiveThemeId(id);
    setThemeId(id);
  };

  const handleSelectColorMode = (mode: ColorMode) => {
    setActiveColorMode(mode);
    setColorMode(mode);
  };

  const handleCustomColorChange = (newHex: string) => {
    setIsCustomMode(true);
    setActiveThemeId('personalizado');
    setCustomHex(newHex);
    setThemeId('personalizado', { primary: newHex, accent: newHex });
  };

  const handleResetDefaults = () => {
    setIsCustomMode(false);
    setActiveThemeId('dourado_real');
    setActiveColorMode('light');
    setColorMode('light');
    setThemeId('dourado_real');
  };

  const handleSave = () => {
    if (isCustomMode) {
      setThemeId('personalizado', { primary: customHex, accent: customHex });
    } else {
      setThemeId(activeThemeId);
    }
    setColorMode(activeColorMode);
    handleClose();
  };

  const churchThemeList = [
    { 
      id: 'dourado_real' as PlatformThemeId, 
      name: 'Dourado Real & Âmbar', 
      hex: '#f59e0b', 
      desc: 'Solenidade e reverência clássica (Padrão)',
      symbol: '👑'
    },
    { 
      id: 'azul_celestial' as PlatformThemeId, 
      name: 'Azul Celestial & Marinho', 
      hex: '#2563eb', 
      desc: 'Tradição, fé, serenidade e harmonia',
      symbol: '⛪'
    },
    { 
      id: 'rubi_fogo' as PlatformThemeId, 
      name: 'Rubi Fogo & Avivamento', 
      hex: '#e11d48', 
      desc: 'Chama do Espírito Santo e paixão pelo Reino',
      symbol: '🔥'
    },
    { 
      id: 'esmeralda_vida' as PlatformThemeId, 
      name: 'Esmeralda & Vida Nova', 
      hex: '#059669', 
      desc: 'Renovação espiritual, crescimento e esperança',
      symbol: '🌿'
    },
    { 
      id: 'purpura_nobre' as PlatformThemeId, 
      name: 'Púrpura Real & Majestade', 
      hex: '#7c3aed', 
      desc: 'Realeza de Cristo, sacerdócio e honra',
      symbol: '✝️'
    },
    { 
      id: 'oceano_profundo' as PlatformThemeId, 
      name: 'Oceano & Ciano da Graça', 
      hex: '#0891b2', 
      desc: 'Frescor moderno, juventude e águas profundas',
      symbol: '🌊'
    },
    { 
      id: 'onix_moderno' as PlatformThemeId, 
      name: 'Ônix & Grafite Contemporâneo', 
      hex: '#334155', 
      desc: 'Design minimalista, sobriedade e elegância',
      symbol: '🛡️'
    },
  ];

  const quickCustomColors = [
    { label: 'Ouro Nobre', hex: '#d97706' },
    { label: 'Azul Real', hex: '#1d4ed8' },
    { label: 'Bordô / Vinho', hex: '#991b1b' },
    { label: 'Verde Floresta', hex: '#065f46' },
    { label: 'Violeta Real', hex: '#581c87' },
    { label: 'Cobre / Terracota', hex: '#c2410c' },
    { label: 'Petróleo', hex: '#0f766e' },
    { label: 'Grafite Escuro', hex: '#1e293b' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all">
        
        {/* Header - Matching EmblemCustomizerModal aesthetic */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-xs transition-colors"
              style={{ backgroundColor: previewPrimaryHex }}
            >
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                Personalizar Paleta de Cores da Igreja
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajuste a identidade visual e o modo de exibição de todo o sistema
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar - Matching EmblemCustomizerModal style */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden border-b border-slate-800">
          <div className="relative z-10 flex flex-col items-center w-full">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-2.5 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: previewPrimaryHex }} />
              <span>Pré-visualização ao Vivo na Barra Lateral & Cabeçalho</span>
            </span>

            {/* Emblem and Branding Preview Card */}
            <div className="w-full max-w-md p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ChurchEmblemRenderer 
                    emblem={churchProfile.emblem} 
                    churchName={churchProfile.name}
                    size="md"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm leading-tight truncate">
                      {churchProfile.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span 
                        className="text-xs font-black tracking-widest transition-colors"
                        style={{ color: previewPrimaryHex }}
                      >
                        ATOS
                      </span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold border border-slate-700/80">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sample Action Button */}
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-white shadow-xs shrink-0 transition-all active:scale-95"
                  style={{ backgroundColor: previewPrimaryHex }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Novo</span>
                </button>
              </div>

              {/* Sample Active Menu Pill */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-xl font-bold transition-all"
                  style={{ 
                    backgroundColor: `${previewPrimaryHex}20`, 
                    color: previewPrimaryHex 
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full shadow-xs" 
                    style={{ backgroundColor: previewPrimaryHex }} 
                  />
                  <span>Membros & Secretaria (Ativo)</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Modo:</span>
                  <span className="font-semibold text-slate-200">
                    {activeColorMode === 'dark' ? '🌙 Escuro' : '☀️ Claro'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ambient Glow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{ 
              background: `radial-gradient(circle at center, ${previewPrimaryHex}25 0%, transparent 70%)` 
            }}
          />
        </div>

        {/* Customization Options Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[50vh] sm:max-h-[55vh] overflow-y-auto">
          
          {/* Section 1: Modo Claro e Modo Escuro */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-2">
              1. Modo de Exibição da Plataforma
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Light Mode Button */}
              <button
                type="button"
                onClick={() => handleSelectColorMode('light')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeColorMode === 'light'
                    ? 'bg-amber-50/80 dark:bg-slate-800 border-amber-500 text-slate-900 dark:text-white font-bold ring-2 ring-amber-400/30 shadow-xs'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span>Modo Claro</span>
                </div>
                {activeColorMode === 'light' && (
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </button>

              {/* Dark Mode Button */}
              <button
                type="button"
                onClick={() => handleSelectColorMode('dark')}
                style={activeColorMode === 'dark' ? {
                  borderColor: previewPrimaryHex,
                  backgroundColor: `${previewPrimaryHex}15`
                } : undefined}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeColorMode === 'dark'
                    ? 'text-slate-900 dark:text-white font-bold ring-2 shadow-xs'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold"
                    style={{ color: previewPrimaryHex }}
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </div>
                  <span>Modo Escuro</span>
                </div>
                {activeColorMode === 'dark' && (
                  <Check className="w-4 h-4" style={{ color: previewPrimaryHex }} />
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Paletas Eclesiásticas Selecionáveis */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-2">
              2. Paletas Eclesiásticas Prontas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {churchThemeList.map(item => {
                const isSelected = !isCustomMode && activeThemeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPresetTheme(item.id)}
                    style={isSelected ? {
                      borderColor: item.hex,
                      backgroundColor: `${item.hex}15`
                    } : undefined}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'font-bold ring-2 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs font-bold"
                      style={{ backgroundColor: item.hex }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-800 dark:text-white text-xs leading-tight">
                          {item.name}
                        </p>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color: item.hex }} />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Cor Personalizada (HEX) da Congregação */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <label className="font-bold text-slate-800 dark:text-white text-xs">
                  3. Cor Personalizada da Igreja (HEX)
                </label>
              </div>
              {isCustomMode && (
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: customHex }}
                >
                  Ativa
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Digite o código HEX da identidade visual da igreja ou selecione pelo seletor de cores:
            </p>

            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={customHex}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent p-0.5 shrink-0"
                title="Clique para escolher qualquer cor"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#f59e0b"
                className="w-28 px-3 py-2 text-xs font-mono font-bold uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleCustomColorChange(customHex)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Aplicar HEX
              </button>
            </div>

            {/* Quick Swatches */}
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Cores Institucionais Populares:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickCustomColors.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => handleCustomColorChange(c.hex)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 text-[10px] text-slate-700 dark:text-slate-300 cursor-pointer transition-all"
                    title={c.label}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer - Matching EmblemCustomizerModal style */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            title="Restaurar cor padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-white"
              style={{ backgroundColor: previewPrimaryHex }}
            >
              <Save className="w-4 h-4" />
              <span>Salvar Paleta</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
