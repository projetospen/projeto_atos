import React from 'react';
import { ChurchEmblem } from '../../types';
import { 
  Church, 
  Flame, 
  BookOpen, 
  Heart, 
  Crown, 
  Sun, 
  Shield, 
  Star,
  Cross
} from 'lucide-react';

interface ChurchEmblemRendererProps {
  emblem?: ChurchEmblem;
  churchName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ChurchEmblemRenderer: React.FC<ChurchEmblemRendererProps> = ({
  emblem,
  churchName = 'Igreja',
  className = '',
  size = 'md',
}) => {
  const defaultEmblem: ChurchEmblem = {
    type: 'icon',
    iconName: 'cross',
    monogramText: churchName.charAt(0) || 'I',
    gradient: 'from-amber-500 to-amber-300',
    textColor: 'text-slate-950',
    shape: 'rounded',
  };

  const current = emblem || defaultEmblem;

  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  };

  // Shape configurations
  const shapeClasses = {
    rounded: 'rounded-xl',
    circle: 'rounded-full',
    shield: 'rounded-b-2xl rounded-t-lg',
  };

  const shapeClass = shapeClasses[current.shape || 'rounded'];

  // Render Icon
  const renderIcon = (name?: string) => {
    const iconClass = `${iconSizes[size]} ${current.textColor || 'text-slate-950'}`;
    switch (name) {
      case 'church': return <Church className={iconClass} />;
      case 'flame': return <Flame className={iconClass} />;
      case 'book': return <BookOpen className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      case 'crown': return <Crown className={iconClass} />;
      case 'sun': return <Sun className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'star': return <Star className={iconClass} />;
      case 'cross':
      default:
        return (
          // Stylized Christian Cross SVG for crisp display
          <svg 
            className={iconClass} 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M10.5 2h3a.5.5 0 0 1 .5.5V7h5.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v10.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V11H4.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H10.5V2.5a.5.5 0 0 1 .5-.5z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${shapeClass} 
        bg-gradient-to-tr ${current.gradient || 'from-amber-500 to-amber-300'} 
        flex items-center justify-center font-black shadow-md shrink-0 overflow-hidden relative
        ${className}
      `}
    >
      {current.type === 'image' && current.imageUrl ? (
        <img
          src={current.imageUrl}
          alt={churchName}
          className="w-full h-full object-cover"
        />
      ) : current.type === 'monogram' ? (
        <span className={`font-serif font-black tracking-tighter ${current.textColor || 'text-slate-950'}`}>
          {current.monogramText || churchName.charAt(0) || 'A'}
        </span>
      ) : (
        renderIcon(current.iconName)
      )}
    </div>
  );
};
