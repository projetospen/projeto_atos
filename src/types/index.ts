export type MemberStatus = 'ativo' | 'em_observacao' | 'afastado' | 'transferido' | 'falecido';

export type MaritalStatus = 
  | 'solteiro' 
  | 'solteira' 
  | 'casado' 
  | 'casada' 
  | 'viuvo' 
  | 'viuva' 
  | 'divorciado' 
  | 'divorciada' 
  | 'outro';

export type MinistryRole = 
  | 'Membro'
  | 'Congregado / Visitante'
  | 'Diácono'
  | 'Diaconisa'
  | 'Presbítero'
  | 'Evangelista'
  | 'Pastor'
  | 'Pastora'
  | 'Líder de Louvor'
  | 'Líder de Jovens'
  | 'Líder Infantil'
  | 'Professor(a) EBD'
  | 'Músico / Instrumentista'
  | 'Sonoplasta / Mídia'
  | 'Tesoureiro(a)'
  | 'Secretário(a)';

export interface Member {
  id: string;
  name: string;
  cpf?: string;
  rg?: string;
  email: string;
  phone: string;
  photoUrl?: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'masculino' | 'feminino';
  maritalStatus: MaritalStatus;
  spouseName?: string;
  childrenCount?: number;
  
  // Endereço
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;

  // Vida Eclesiástica
  status: MemberStatus;
  role: MinistryRole;
  isBaptizedWater: boolean;
  waterBaptismDate?: string;
  isBaptizedHolySpirit: boolean;
  membershipDate: string; // Data de membresia
  previousChurch?: string;
  departmentIds: string[]; // Departamentos que participa
  
  // Informações adicionais
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string; // lucide icon identifier
  color: string; // tailwind color class
  leaderMemberId: string;
  viceLeaderMemberId?: string;
  meetingSchedule?: string; // ex: "Terças às 19h30"
  meetingLocation?: string;
  monthlyBudget?: number;
  goals?: string[];
  bannerUrl?: string;
}

export type EventCategory = 
  | 'culto_geral'
  | 'culto_jovens'
  | 'oracao'
  | 'ebd'
  | 'ensaio'
  | 'santa_ceia'
  | 'batismo'
  | 'acao_social'
  | 'conferencia'
  | 'reuniao_lideranca';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate?: string;
  endTime?: string;
  location: string;
  departmentId?: string;
  speakerOrPreacher?: string;
  isRecurring?: boolean;
  targetAudience?: string; // Toda a igreja, Mulheres, Homens, Jovens, Casais
  requiresRegistration?: boolean;
  maxAttendees?: number;
  color?: string;
}

export interface VolunteerDuty {
  id: string;
  eventId?: string;
  date: string; // YYYY-MM-DD
  serviceTitle: string; // Ex: Culto de Domingo Noite
  departmentId: string;
  roles: {
    roleName: string; // Ex: "Vocal Principal", "Recepção Porta 1", "Mídia/Slide"
    memberId: string;
    confirmed: boolean;
  }[];
  notes?: string;
}

export type TransactionType = 'entrada' | 'saida';

export type TransactionCategory =
  | 'dizimo'
  | 'oferta_geral'
  | 'oferta_missoes'
  | 'campanha_construcao'
  | 'cantina_eventos'
  | 'energia_eletrica'
  | 'agua'
  | 'aluguel'
  | 'manutencao_templo'
  | 'ajuda_custo_pastoral'
  | 'missoes_envio'
  | 'material_ebd'
  | 'equipamentos_som_multimidia'
  | 'acao_social_cestas'
  | 'outros';

export interface FinancialTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  memberId?: string; // Se for dízimo ou oferta nominal
  departmentId?: string;
  paymentMethod: 'pix' | 'dinheiro' | 'cartao' | 'transferencia' | 'boleto';
  receiptNumber?: string;
  createdBy: string;
}

export type EmblemType = 'icon' | 'monogram' | 'image';
export type EmblemIcon = 'cross' | 'church' | 'flame' | 'book' | 'crown' | 'heart' | 'star' | 'sun' | 'shield';

export interface ChurchEmblem {
  type: EmblemType;
  iconName?: EmblemIcon;
  monogramText?: string;
  imageUrl?: string;
  gradient: string;
  textColor?: string;
  shape?: 'rounded' | 'circle' | 'shield';
}

export type ColorMode = 'light' | 'dark';

export type PlatformThemeId = 
  | 'dourado_real'
  | 'azul_celestial'
  | 'rubi_fogo'
  | 'esmeralda_vida'
  | 'purpura_nobre'
  | 'oceano_profundo'
  | 'vinho_alianca'
  | 'bronze_altar'
  | 'indigo_santuario'
  | 'oliva_getsemani'
  | 'rosa_shekinah'
  | 'carvalho_tabernaculo'
  | 'turquesa_aguas'
  | 'onix_moderno'
  | 'personalizado';

export interface ThemeDarkModeConfig {
  bgBase: string;       // Deep page background for dark mode (e.g. #0c0a06)
  bgCard: string;       // Elevated card/container background for dark mode (e.g. #17130b)
  bgSurface: string;    // Inner surface/dropdown/hover background (e.g. #231d10)
  borderColor: string;  // Card/element borders in dark mode (e.g. #382e18)
  borderSubtle: string; // Subtle divider lines (e.g. #282010)
  glowColor: string;    // Soft ambient glow
}

export interface PlatformTheme {
  id: PlatformThemeId;
  name: string;
  tagline: string;
  primaryHex: string;
  primaryHoverHex: string;
  accentHex: string;
  sidebarActiveBg: string;
  sidebarAccentText: string;
  btnPrimary: string;
  btnSecondary: string;
  bannerGradient: string;
  bannerAccentBadge: string;
  badgeBg: string;
  textAccent: string;
  borderAccent: string;
  ringColor: string;
  cardHighlight: string;
  darkModeConfig: ThemeDarkModeConfig;
}

export interface ChurchProfile {
  name: string;
  subtitle: string;
  seniorPastor: string;
  secretaryName: string;
  treasurerName: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  cityState: string;
  foundingDate: string;
  logoUrl?: string;
  emblem?: ChurchEmblem;
  themeId?: PlatformThemeId;
  customPrimaryColor?: string;
  customAccentColor?: string;
  colorMode?: ColorMode;
  mottoVerse: string;
  socialInstagram?: string;
  bankPixKey?: string;
}

export type NavTab = 
  | 'dashboard'
  | 'membros'
  | 'departamentos'
  | 'calendario'
  | 'escalas'
  | 'financeiro'
  | 'relatorios'
  | 'configuracoes';

export type AdminRole = 
  | 'Administrador Geral' 
  | 'Pastor Presidente' 
  | 'Secretaria Eclesiástica' 
  | 'Tesouraria' 
  | 'Líder de Ministério';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string; // ID of the specific department for Ministry Leaders
  departmentName?: string;
}

export interface RolePermissionConfig {
  allowedTabs: NavTab[];
  defaultTab: NavTab;
  scopeLabel: string;
  description: string;
}

export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissionConfig> = {
  'Pastor Presidente': {
    allowedTabs: ['dashboard', 'membros', 'departamentos', 'calendario', 'escalas', 'financeiro', 'relatorios', 'configuracoes'],
    defaultTab: 'dashboard',
    scopeLabel: 'Acesso Geral à Plataforma',
    description: 'Acesso irrestrito a todos os módulos, tesouraria, secretaria e configurações.',
  },
  'Administrador Geral': {
    allowedTabs: ['dashboard', 'membros', 'departamentos', 'calendario', 'escalas', 'financeiro', 'relatorios', 'configuracoes'],
    defaultTab: 'dashboard',
    scopeLabel: 'Acesso Administrativo Total',
    description: 'Gestão completa do sistema, módulos e permissões da igreja.',
  },
  'Secretaria Eclesiástica': {
    allowedTabs: ['membros', 'calendario', 'escalas', 'relatorios'],
    defaultTab: 'membros',
    scopeLabel: 'Secretaria, Membros, Escalas & Relatórios',
    description: 'Acesso a Membros & Secretaria, Calendário, Escalas de Voluntários e Relatórios.',
  },
  'Líder de Ministério': {
    allowedTabs: ['departamentos', 'calendario'],
    defaultTab: 'departamentos',
    scopeLabel: 'Seu Próprio Departamento & Calendário',
    description: 'Acesso exclusivo ao seu próprio departamento ministerial e à agenda/calendário.',
  },
  'Tesouraria': {
    allowedTabs: ['financeiro'],
    defaultTab: 'financeiro',
    scopeLabel: 'Exclusivo Tesouraria & Dízimos',
    description: 'Acesso exclusivo ao Livro Caixa, entradas de dízimos/ofertas e tesouraria.',
  },
};

export const isTabAllowed = (role: AdminRole, tab: NavTab): boolean => {
  const config = ROLE_PERMISSIONS[role];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
};

