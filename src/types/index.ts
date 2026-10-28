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

export interface ChurchModulesConfig {
  financial: boolean;     // Módulo Financeiro (Dízimos e Despesas)
  schedules: boolean;     // Módulo de Escalas de Voluntários
  departments: boolean;   // Módulo de Departamentos e Ministérios
  events: boolean;        // Módulo de Calendário de Eventos
}

export const DEFAULT_CHURCH_MODULES: ChurchModulesConfig = {
  financial: true,
  schedules: true,
  departments: true,
  events: true,
};

export type RoleModulesConfig = Record<AdminRole, ChurchModulesConfig>;

export const DEFAULT_ROLE_MODULES: Record<AdminRole, ChurchModulesConfig> = {
  'Pastor Presidente': {
    financial: true,
    schedules: true,
    departments: true,
    events: true,
  },
  'Administrador Geral': {
    financial: true,
    schedules: true,
    departments: true,
    events: true,
  },
  'Secretaria Eclesiástica': {
    financial: false,
    schedules: true,
    departments: true,
    events: true,
  },
  'Tesouraria': {
    financial: true,
    schedules: false,
    departments: false,
    events: false,
  },
  'Líder de Ministério': {
    financial: false,
    schedules: true,
    departments: true,
    events: true,
  },
};

export interface RoleDefinition {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  iconName: string;
  color: string;
  isAdmin: boolean;
  isSystem?: boolean;
  defaultTab: NavTab;
  allowedTabs: NavTab[];
  modules: ChurchModulesConfig;
}

export const DEFAULT_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'role-pastor-presidente',
    name: 'Pastor Presidente',
    subtitle: 'Direção Geral, Conselho Pastoral e Gestão Ministerial Plena (Acesso Total)',
    badge: 'Liderança Pastoral',
    iconName: 'Crown',
    color: 'from-amber-500 to-amber-600',
    isAdmin: true,
    isSystem: true,
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'membros', 'departamentos', 'calendario', 'escalas', 'financeiro', 'relatorios', 'configuracoes'],
    modules: {
      financial: true,
      schedules: true,
      departments: true,
      events: true,
    }
  },
  {
    id: 'role-admin-geral',
    name: 'Administrador Geral',
    subtitle: 'Gestão Completa da Plataforma, Módulos, Segurança e Cadastros (Acesso Total)',
    badge: 'Administração Geral',
    iconName: 'ShieldCheck',
    color: 'from-blue-600 to-indigo-700',
    isAdmin: true,
    isSystem: true,
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'membros', 'departamentos', 'calendario', 'escalas', 'financeiro', 'relatorios', 'configuracoes'],
    modules: {
      financial: true,
      schedules: true,
      departments: true,
      events: true,
    }
  },
  {
    id: 'role-secretaria',
    name: 'Secretaria Eclesiástica',
    subtitle: 'Cadastro Geral de Membros, Fichas de Batismo, Atas e Carteirinhas',
    badge: 'Secretaria & Membresia',
    iconName: 'Users',
    color: 'from-cyan-600 to-teal-700',
    isAdmin: false,
    isSystem: true,
    defaultTab: 'membros',
    allowedTabs: ['membros', 'calendario', 'escalas', 'relatorios'],
    modules: {
      financial: false,
      schedules: true,
      departments: true,
      events: true,
    }
  },
  {
    id: 'role-tesouraria',
    name: 'Tesouraria',
    subtitle: 'Entradas de Dízimos, Ofertas, Saídas, Livro Caixa e Relatórios',
    badge: 'Gestão Contábil',
    iconName: 'CircleDollarSign',
    color: 'from-emerald-600 to-green-700',
    isAdmin: false,
    isSystem: true,
    defaultTab: 'financeiro',
    allowedTabs: ['financeiro'],
    modules: {
      financial: true,
      schedules: false,
      departments: false,
      events: false,
    }
  },
  {
    id: 'role-lider-ministerio',
    name: 'Líder de Ministério',
    subtitle: 'Gestão Departamental (Louvor, Diaconia, Jovens, Kids, Mídia...)',
    badge: 'Coordenação Departamental',
    iconName: 'Building2',
    color: 'from-orange-500 to-rose-600',
    isAdmin: false,
    isSystem: true,
    defaultTab: 'departamentos',
    allowedTabs: ['departamentos', 'calendario'],
    modules: {
      financial: false,
      schedules: true,
      departments: true,
      events: true,
    }
  }
];

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
  enabledModules?: ChurchModulesConfig;
  roleModulesConfig?: Record<string, ChurchModulesConfig>;
  customRoles?: RoleDefinition[];
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

export type DefaultAdminRole = 
  | 'Administrador Geral' 
  | 'Pastor Presidente' 
  | 'Secretaria Eclesiástica' 
  | 'Tesouraria' 
  | 'Líder de Ministério';

export type AdminRole = DefaultAdminRole | (string & {});

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string; // ID of the specific department for Ministry Leaders
  departmentName?: string;
  themeId?: PlatformThemeId;
  customPrimaryColor?: string;
  customAccentColor?: string;
  colorMode?: ColorMode;
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

export const isAdminRole = (role: AdminRole, customRoles?: RoleDefinition[]): boolean => {
  if (customRoles) {
    const found = customRoles.find(r => r.name === role || r.id === role);
    if (found) return found.isAdmin;
  }
  return role === 'Pastor Presidente' || role === 'Administrador Geral';
};

export const getRoleModuleConfig = (
  churchProfile: ChurchProfile | undefined, 
  role: AdminRole,
  customRoles?: RoleDefinition[]
): ChurchModulesConfig => {
  if (churchProfile?.roleModulesConfig?.[role]) {
    return churchProfile.roleModulesConfig[role];
  }
  const rolesList = customRoles || churchProfile?.customRoles;
  if (rolesList) {
    const found = rolesList.find(r => r.name === role || r.id === role);
    if (found) return found.modules;
  }
  return DEFAULT_ROLE_MODULES[role] || DEFAULT_CHURCH_MODULES;
};

export const isModuleActiveForRole = (
  churchProfile: ChurchProfile | undefined,
  role: AdminRole,
  moduleKey: keyof ChurchModulesConfig,
  customRoles?: RoleDefinition[]
): boolean => {
  // 1. Chave mestre geral da igreja: se desligado globalmente, fica desativado para todos
  const churchModules = churchProfile?.enabledModules ?? DEFAULT_CHURCH_MODULES;
  if (churchModules[moduleKey] === false) return false;

  // 2. Chave específica do perfil:
  // REGRA: Mesmo para Pastor Presidente e Administrador Geral, se desativar um módulo para
  // o seu próprio perfil, ele não terá acesso até ativá-lo novamente nas configurações.
  const rolesList = customRoles || churchProfile?.customRoles;
  const roleConfig = getRoleModuleConfig(churchProfile, role, rolesList);
  return roleConfig[moduleKey] !== false;
};

export const isTabAllowed = (
  role: AdminRole, 
  tab: NavTab, 
  churchProfile?: ChurchProfile,
  customRoles?: RoleDefinition[]
): boolean => {
  const rolesList = customRoles || churchProfile?.customRoles;
  const isAdmin = isAdminRole(role, rolesList);

  // 1. Configurações: exclusivo para Administradores (Pastor Presidente, Administrador Geral, etc.)
  // Permanece sempre acessível para os administradores poderem gerenciar e reativar módulos a qualquer momento
  if (tab === 'configuracoes') {
    return isAdmin;
  }

  // 2. Módulo de Membros & Secretaria é permanente e acessível para todos os perfis
  if (tab === 'membros') return true;

  // 3. Módulos opcionais vinculados a toggles (Financeiro, Escalas, Departamentos, Calendário)
  // REGRA: Mesmo para Administrador Geral e Pastor Presidente, quando desativar um módulo para o
  // seu próprio perfil ou na igreja, o acesso fica bloqueado e oculto até ativá-lo novamente.
  if (tab === 'financeiro') return isModuleActiveForRole(churchProfile, role, 'financial', rolesList);
  if (tab === 'escalas') return isModuleActiveForRole(churchProfile, role, 'schedules', rolesList);
  if (tab === 'departamentos') return isModuleActiveForRole(churchProfile, role, 'departments', rolesList);
  if (tab === 'calendario') return isModuleActiveForRole(churchProfile, role, 'events', rolesList);

  // 4. Abas de sistema (dashboard, relatórios):
  // Administradores têm acesso padrão a dashboard e relatórios
  if (isAdmin) {
    return true;
  }

  // Para outros perfis, verificar permissão da role
  if (rolesList) {
    const roleDef = rolesList.find(r => r.name === role || r.id === role);
    if (roleDef?.allowedTabs) {
      return roleDef.allowedTabs.includes(tab);
    }
  }

  const config = (ROLE_PERMISSIONS as any)[role];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
};

