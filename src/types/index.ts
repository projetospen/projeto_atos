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
  mottoVerse: string;
  socialInstagram?: string;
  bankPixKey?: string;
}
