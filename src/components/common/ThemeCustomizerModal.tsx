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
      desc: 'Solenidade, nobreza e iluminação espiritual (Padrão)',
      symbol: '👑'
    },
    { 
      id: 'azul_celestial' as PlatformThemeId, 
      name: 'Azul Celestial & Marinho', 
      hex: '#2563eb', 
      desc: 'Tradição, reverência, fé e serenidade clássica',
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
      name: 'Púrpura & Majestade Real', 
      hex: '#7c3aed', 
      desc: 'Realeza de Cristo, sacerdócio santo e glória',
      symbol: '✝️'
    },
    { 
      id: 'oceano_profundo' as PlatformThemeId, 
      name: 'Oceano & Ciano da Graça', 
      hex: '#0891b2', 
      desc: 'Frescor contemporâneo, juventude e águas profundas',
      symbol: '🌊'
    },
    { 
      id: 'vinho_alianca' as PlatformThemeId, 
      name: 'Vinho & Cálice da Aliança', 
      hex: '#b91c1c', 
      desc: 'Comunhão da ceia, santa aliança e sangue de Cristo',
      symbol: '🍷'
    },
    { 
      id: 'bronze_altar' as PlatformThemeId, 
      name: 'Bronze & Fogo do Altar', 
      hex: '#ea580c', 
      desc: 'Altar de adoração ardente, consagração e fervor',
      symbol: '🕯️'
    },
    { 
      id: 'indigo_santuario' as PlatformThemeId, 
      name: 'Índigo & Santuário Sagrado', 
      hex: '#4f46e5', 
      desc: 'Mistério divino, profundidade bíblica e oração',
      symbol: '📖'
    },
    { 
      id: 'oliva_getsemani' as PlatformThemeId, 
      name: 'Verde Oliva & Getsêmani', 
      hex: '#65a30d', 
      desc: 'Monte das Oliveiras, paz celestial e unção de vida',
      symbol: '🕊️'
    },
    { 
      id: 'rosa_shekinah' as PlatformThemeId, 
      name: 'Rosa Shekinah & Glória', 
      hex: '#db2777', 
      desc: 'Rosa de Sarom, júbilo no Espírito e graça resplandecente',
      symbol: '🌸'
    },
    { 
      id: 'carvalho_tabernaculo' as PlatformThemeId, 
      name: 'Carvalho & Tabernáculo', 
      hex: '#92400e', 
      desc: 'Solidez dos patriarcas, acácia e santuário bíblico',
      symbol: '🏛️'
    },
    { 
      id: 'turquesa_aguas' as PlatformThemeId, 
      name: 'Turquesa & Águas de Repouso', 
      hex: '#0d9488', 
      desc: 'Salmo 23, águas tranquilas e refrigério da alma',
      symbol: '💧'
    },
    { 
      id: 'onix_moderno' as PlatformThemeId, 
      name: 'Ônix & Grafite Contemporâneo', 
      hex: '#334155', 
      desc: 'Design minimalista, sobriedade, ordem e elegância',
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
                14 paletas sagradas com Modo Escuro adaptativo personalizado
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

        {/* Live Preview Bar - Adapts to chosen theme AND selected color mode */}
        <div 
          className="p-5 sm:p-6 text-white flex flex-col items-center justify-center relative overflow-hidden border-b transition-colors duration-300"
          style={{
            backgroundColor: activeColorMode === 'dark' 
              ? currentComputedTheme.darkModeConfig.bgBase 
              : '#0f172a',
            borderColor: activeColorMode === 'dark' 
              ? currentComputedTheme.darkModeConfig.borderColor 
              : '#1e293b',
          }}
        >
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex items-center justify-between w-full max-w-md mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: previewPrimaryHex }} />
                <span>Pré-visualização do Sistema</span>
              </span>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all"
                style={{
                  backgroundColor: activeColorMode === 'dark' ? `${previewPrimaryHex}20` : '#ffffff15',
                  color: previewPrimaryHex,
                  borderColor: `${previewPrimaryHex}40`
                }}
              >
                {activeColorMode === 'dark' ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
              </span>
            </div>

            {/* Emblem and Branding Preview Card */}
            <div 
              className="w-full max-w-md p-3.5 rounded-2xl flex flex-col gap-3 shadow-xl transition-all duration-300"
              style={{
                backgroundColor: activeColorMode === 'dark' 
                  ? currentComputedTheme.darkModeConfig.bgCard 
                  : '#1e293b',
                borderColor: activeColorMode === 'dark' 
                  ? currentComputedTheme.darkModeConfig.borderColor 
                  : '#334155',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: `0 10px 25px -5px ${currentComputedTheme.darkModeConfig.glowColor}`
              }}
            >
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
                      <span 
                        className="text-[9px] px-1.5 py-0.2 rounded font-semibold border"
                        style={{
                          backgroundColor: activeColorMode === 'dark' 
                            ? currentComputedTheme.darkModeConfig.bgSurface 
                            : '#0f172a',
                          borderColor: activeColorMode === 'dark' 
                            ? currentComputedTheme.darkModeConfig.borderSubtle 
                            : '#334155',
                          color: '#cbd5e1'
                        }}
                      >
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
              <div 
                className="flex items-center justify-between pt-2.5 text-xs"
                style={{
                  borderTop: `1px solid ${activeColorMode === 'dark' ? currentComputedTheme.darkModeConfig.borderSubtle : '#334155'}`
                }}
              >
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-xl font-bold transition-all"
                  style={{ 
                    backgroundColor: `${previewPrimaryHex}22`, 
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
                  <span>Tom Escuro:</span>
                  <span 
                    className="w-3.5 h-3.5 rounded-full inline-block border" 
                    style={{ 
                      backgroundColor: currentComputedTheme.darkModeConfig.bgCard,
                      borderColor: currentComputedTheme.darkModeConfig.borderColor
                    }}
                    title={`Tom de fundo do modo escuro: ${currentComputedTheme.darkModeConfig.bgCard}`}
                  />
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
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                1. Modo de Exibição da Plataforma
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                O Modo Escuro adapta seus tons de fundo à paleta ativa
              </span>
            </div>
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
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                2. Paletas Eclesiásticas Prontas ({churchThemeList.length} Opções)
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Clique para ativar instantaneamente
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {churchThemeList.map(item => {
                const isSelected = !isCustomMode && activeThemeId === item.id;
                const itemTheme = platformThemes[item.id as Exclude<PlatformThemeId, 'personalizado'>];
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
                    {/* Primary Color & Dark Tone dual badge */}
                    <div className="relative shrink-0">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs font-bold"
                        style={{ backgroundColor: item.hex }}
                        title={`Cor Primária: ${item.hex}`}
                      >
                        <span className="text-xs">{item.symbol}</span>
                      </div>
                      {/* Dark tone dot indicator */}
                      <span 
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white dark:border-slate-900 shadow-2xs"
                        style={{ backgroundColor: itemTheme?.darkModeConfig.bgCard || '#000000' }}
                        title={`Tom escuro adaptado correspondente`}
                      />
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
