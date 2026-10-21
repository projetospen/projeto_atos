import React, { useState } from 'react';
import { ChurchEmblem, EmblemIcon, EmblemType } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { ChurchEmblemRenderer } from './ChurchEmblemRenderer';
import { 
  X, 
  Sparkles, 
  Save, 
  Type, 
  Image as ImageIcon, 
  Church, 
  Flame, 
  BookOpen, 
  Heart, 
  Crown, 
  Shield, 
  Star, 
  Sun,
  Check
} from 'lucide-react';

interface EmblemCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmblemCustomizerModal: React.FC<EmblemCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { churchProfile, updateChurchProfile } = useChurch();

  const [emblem, setEmblem] = useState<ChurchEmblem>(() => {
    return churchProfile.emblem || {
      type: 'icon',
      iconName: 'cross',
      monogramText: 'GP',
      gradient: 'from-amber-500 to-amber-300',
      textColor: 'text-slate-950',
      shape: 'rounded',
    };
  });

  if (!isOpen) return null;

  const iconOptions: { id: EmblemIcon; label: string; icon: React.ElementType }[] = [
    { id: 'cross', label: 'Cruz Sagrada', icon: Sparkles },
    { id: 'church', label: 'Templo / Igreja', icon: Church },
    { id: 'flame', label: 'Chama do Espírito', icon: Flame },
    { id: 'book', label: 'Bíblia Aberta', icon: BookOpen },
    { id: 'crown', label: 'Coroa da Glória', icon: Crown },
    { id: 'shield', label: 'Escudo da Fé', icon: Shield },
    { id: 'heart', label: 'Amor / Comunhão', icon: Heart },
    { id: 'star', label: 'Estrela / Guia', icon: Star },
    { id: 'sun', label: 'Sol da Justiça', icon: Sun },
  ];

  const gradientOptions = [
    { id: 'amber', label: 'Dourado Real', class: 'from-amber-500 to-amber-300', text: 'text-slate-950' },
    { id: 'blue', label: 'Azul Celestial', class: 'from-blue-600 to-indigo-500', text: 'text-white' },
    { id: 'red', label: 'Fogo & Avivamento', class: 'from-red-600 to-rose-400', text: 'text-white' },
    { id: 'purple', label: 'Púrpura Real', class: 'from-purple-600 to-violet-400', text: 'text-white' },
    { id: 'green', label: 'Verde Esperança', class: 'from-emerald-600 to-teal-400', text: 'text-white' },
    { id: 'cyan', label: 'Ciano Luz', class: 'from-cyan-500 to-blue-600', text: 'text-slate-950' },
    { id: 'dark', label: 'Grafite & Prata', class: 'from-slate-700 to-slate-950', text: 'text-amber-300' },
  ];

  const shapeOptions: { id: 'rounded' | 'circle' | 'shield'; label: string }[] = [
    { id: 'rounded', label: 'Arredondado Moderno' },
    { id: 'circle', label: 'Círculo Clássico' },
    { id: 'shield', label: 'Brasão / Escudo' },
  ];

  const handleSave = () => {
    updateChurchProfile({
      ...churchProfile,
      emblem,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">Personalizar Emblema da Igreja</h3>
              <p className="text-xs text-slate-500">Defina o ícone, monograma ou logotipo oficial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-6 bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden border-b border-slate-800">
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
              Pré-visualização ao Vivo na Barra Lateral
            </span>

            {/* Emblem Renderer */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center gap-3">
              <ChurchEmblemRenderer 
                emblem={emblem} 
                churchName={churchProfile.name}
                size="lg"
              />
              <div className="text-left">
                <h4 className="font-bold text-white text-base leading-tight">
                  {churchProfile.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black tracking-wider text-amber-400">ATOS</span>
                  <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-5 text-xs max-h-[55vh] overflow-y-auto">
          {/* Emblem Type Tabs */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Tipo de Emblema</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEmblem({ ...emblem, type: 'icon' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  emblem.type === 'icon' 
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs font-bold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Church className="w-4 h-4" />
                <span>Ícone / Símbolo</span>
              </button>

              <button
                type="button"
                onClick={() => setEmblem({ ...emblem, type: 'monogram' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  emblem.type === 'monogram' 
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs font-bold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Monograma</span>
              </button>

              <button
                type="button"
                onClick={() => setEmblem({ ...emblem, type: 'image' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  emblem.type === 'image' 
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs font-bold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Logo / Imagem</span>
              </button>
            </div>
          </div>

          {/* Conditional Controls by Type */}
          {emblem.type === 'icon' && (
            <div>
              <label className="block font-bold text-slate-700 mb-2">Escolha o Símbolo Eclesiástico</label>
              <div className="grid grid-cols-3 gap-2">
                {iconOptions.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = (emblem.iconName || 'cross') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEmblem({ ...emblem, iconName: opt.id })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold ring-2 ring-amber-400/30' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-800" />
                      </div>
                      <span className="text-[11px] leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {emblem.type === 'monogram' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Texto do Monograma / Iniciais (1 a 3 letras)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={emblem.monogramText || ''}
                  onChange={e => setEmblem({ ...emblem, monogramText: e.target.value.toUpperCase() })}
                  placeholder="Ex: GP, IB, A, P"
                  className="w-full px-3 py-2 text-base font-black tracking-widest uppercase border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recomendado: as iniciais do nome da sua congregação (ex: "GP" para Graça & Paz).
                </span>
              </div>
            </div>
          )}

          {emblem.type === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL da Imagem / Brasão da Igreja
                </label>
                <input
                  type="url"
                  value={emblem.imageUrl || ''}
                  onChange={e => setEmblem({ ...emblem, imageUrl: e.target.value })}
                  placeholder="https://suaigreja.com/logo.png"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Insira o link direto de uma imagem PNG ou JPG quadrada do logotipo da sua igreja.
                </span>
              </div>
            </div>
          )}

          {/* Color Gradient Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Paleta de Cores do Emblema</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {gradientOptions.map(g => {
                const isSelected = emblem.gradient === g.class;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setEmblem({ ...emblem, gradient: g.class, textColor: g.text })}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected ? 'border-indigo-600 ring-2 ring-indigo-400/30 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${g.class} shrink-0 shadow-xs flex items-center justify-center`}>
                      {isSelected && <Check className="w-3 h-3 text-slate-900 stroke-3" />}
                    </div>
                    <span className="text-[11px] text-slate-700 truncate">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shape Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Formato do Emblema</label>
            <div className="grid grid-cols-3 gap-2">
              {shapeOptions.map(s => {
                const isSelected = (emblem.shape || 'rounded') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setEmblem({ ...emblem, shape: s.id })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px]">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors font-medium text-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Emblema</span>
          </button>
        </div>
      </div>
    </div>
  );
};
