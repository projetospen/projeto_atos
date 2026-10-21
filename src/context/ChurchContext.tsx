import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Member, 
  Department, 
  ChurchEvent, 
  VolunteerDuty, 
  FinancialTransaction, 
  ChurchProfile,
  PlatformTheme,
  PlatformThemeId,
  ColorMode
} from '../types';
import { getPlatformTheme } from '../data/themeConfig';
import { 
  initialMembers, 
  initialDepartments, 
  initialEvents, 
  initialVolunteerDuties, 
  initialTransactions, 
  initialChurchProfile 
} from '../data/mockData';
import { supabase } from '../lib/supabase';

export type NavTab = 
  | 'dashboard'
  | 'membros'
  | 'departamentos'
  | 'calendario'
  | 'escalas'
  | 'financeiro'
  | 'relatorios'
  | 'configuracoes';

export type AdminRole = 'Administrador Geral' | 'Pastor Presidente' | 'Secretaria Eclesiástica' | 'Tesouraria' | 'Líder de Ministério';

interface ChurchContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  
  churchProfile: ChurchProfile;
  updateChurchProfile: (profile: ChurchProfile) => void;
  theme: PlatformTheme;
  setThemeId: (themeId: PlatformThemeId, customColors?: { primary?: string; accent?: string }) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  departments: Department[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  events: ChurchEvent[];
  addEvent: (event: Omit<ChurchEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<ChurchEvent>) => void;
  deleteEvent: (id: string) => void;
  
  duties: VolunteerDuty[];
  addDuty: (duty: Omit<VolunteerDuty, 'id'>) => void;
  updateDuty: (id: string, duty: Partial<VolunteerDuty>) => void;
  deleteDuty: (id: string) => void;
  toggleDutyConfirmation: (dutyId: string, roleIndex: number) => void;
  
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  selectedMemberForCard: Member | null;
  setSelectedMemberForCard: (member: Member | null) => void;

  exportBackup: () => void;
  importBackup: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'eclesia_church_profile_v1',
  MEMBERS: 'eclesia_members_v1',
  DEPARTMENTS: 'eclesia_departments_v1',
  EVENTS: 'eclesia_events_v1',
  DUTIES: 'eclesia_duties_v1',
  TRANSACTIONS: 'eclesia_transactions_v1',
  ROLE: 'eclesia_admin_role_v1',
  COLOR_MODE: 'atos_color_mode_v1',
};

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [adminRole, setAdminRole] = useState<AdminRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as AdminRole) || 'Secretaria Eclesiástica';
  });

  const [churchProfile, setChurchProfile] = useState<ChurchProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialChurchProfile;
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLOR_MODE);
    if (saved === 'dark' || saved === 'light') return saved;
    if (churchProfile.colorMode) return churchProfile.colorMode;
    return 'light';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialMembers;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialDepartments;
  });

  const [events, setEvents] = useState<ChurchEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialEvents;
  });

  const [duties, setDuties] = useState<VolunteerDuty[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUTIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialVolunteerDuties;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTransactions;
  });

  const [selectedMemberForCard, setSelectedMemberForCard] = useState<Member | null>(null);

  // --- SINCRONIZAÇÃO INICIAL COM O SUPABASE ---
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        // Carrega Membros do Supabase
        const { data: dbMembers } = await supabase.from('members').select('*');
        if (dbMembers && dbMembers.length > 0) {
          const formattedMembers: Member[] = dbMembers.map((m: any) => ({
            ...m,
            id: m.id,
            name: m.name,
            email: m.email || '',
            phone: m.phone || '',
            birthDate: m.birth_date || m.birthDate || '',
            maritalStatus: m.marital_status || m.maritalStatus || 'Solteiro(a)',
            department: m.department || '',
            role: m.role || 'Membro',
            status: m.status || 'Ativo',
            createdAt: m.created_at ? m.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          setMembers(formattedMembers);
        }

        // Carrega Transações Financeiras do Supabase
        const { data: dbTransactions } = await supabase.from('financial_records').select('*');
        if (dbTransactions && dbTransactions.length > 0) {
          const formattedTx: FinancialTransaction[] = dbTransactions.map((t: any) => ({
            ...t,
            id: t.id,
            type: t.type,
            category: t.category,
            amount: Number(t.amount),
            date: t.date,
            description: t.description || ''
          }));
          setTransactions(formattedTx);
        }

        // Carrega Configurações da Igreja
        const { data: dbSettings } = await supabase.from('church_settings').select('*').limit(1).maybeSingle();
        if (dbSettings) {
          setChurchProfile(prev => ({
            ...prev,
            name: dbSettings.name || prev.name,
            pastorName: dbSettings.pastor_name || (prev as any).pastorName || '',
            cnpj: dbSettings.cnpj || (prev as any).cnpj || '',
            verse: dbSettings.verse || (prev as any).verse || '',
            pixKey: dbSettings.pix_key || (prev as any).pixKey || '',
          }));
        }
      } catch (err) {
        console.warn('Usando dados locais ou offline:', err);
      }
    };

    loadFromSupabase();
  }, []);

  // Mantém cópia local sincronizada para resposta instantânea
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(churchProfile));
  }, [churchProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, adminRole);
  }, [adminRole]);

  // --- MEMBER CRUD (Com salvamento no Supabase) ---
  // --- MEMBER CRUD (Com salvamento no Supabase) ---
  const addMember = async (data: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = {
      ...data,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => [newMember, ...prev]);

    try {
      const { error } = await supabase.from('members').insert([{
        id: newMember.id,
        name: newMember.name,
        email: (newMember as any).email || null,
        phone: (newMember as any).phone || null,
        birth_date: (newMember as any).birthDate || null,
        marital_status: (newMember as any).maritalStatus || null,
        department: (newMember as any).department || null,
        role: (newMember as any).role || 'Membro',
        status: (newMember as any).status || 'Ativo'
      }]);

      if (error) {
        alert("⚠️ Supabase recusou: " + error.message);
        console.error("Erro Supabase:", error);
      } else {
        alert("✅ Membro gravado no Supabase com sucesso!");
      }
    } catch (err: any) {
      alert("❌ Erro de conexão: " + err.message);
    }
  };

  const updateMember = async (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));

    try {
      const payload: any = {};
      if (updatedFields.name) payload.name = updatedFields.name;
      if ((updatedFields as any).email !== undefined) payload.email = (updatedFields as any).email;
      if ((updatedFields as any).phone !== undefined) payload.phone = (updatedFields as any).phone;
      if ((updatedFields as any).birthDate !== undefined) payload.birth_date = (updatedFields as any).birthDate;
      if ((updatedFields as any).maritalStatus !== undefined) payload.marital_status = (updatedFields as any).maritalStatus;
      if ((updatedFields as any).department !== undefined) payload.department = (updatedFields as any).department;
      if ((updatedFields as any).role !== undefined) payload.role = (updatedFields as any).role;
      if ((updatedFields as any).status !== undefined) payload.status = (updatedFields as any).status;

      await supabase.from('members').update(payload).eq('id', id);
    } catch (err) {
      console.error('Erro ao atualizar membro no Supabase:', err);
    }
  };

  const deleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    try {
      await supabase.from('members').delete().eq('id', id);
    } catch (err) {
      console.error('Erro ao excluir membro no Supabase:', err);
    }
  };

  // Department CRUD
  const addDepartment = (data: Omit<Department, 'id'>) => {
    const newDept: Department = { ...data, id: `dep-${Date.now()}` };
    setDepartments(prev => [...prev, newDept]);
  };

  const updateDepartment = (id: string, updatedFields: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // Event CRUD
  const addEvent = (data: Omit<ChurchEvent, 'id'>) => {
    const newEvent: ChurchEvent = { ...data, id: `evt-${Date.now()}` };
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.startDate.localeCompare(b.startDate)));
  };

  const updateEvent = (id: string, updatedFields: Partial<ChurchEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Duty CRUD
  const addDuty = (data: Omit<VolunteerDuty, 'id'>) => {
    const newDuty: VolunteerDuty = { ...data, id: `duty-${Date.now()}` };
    setDuties(prev => [newDuty, ...prev]);
  };

  const updateDuty = (id: string, updatedFields: Partial<VolunteerDuty>) => {
    setDuties(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
  };

  const deleteDuty = (id: string) => {
    setDuties(prev => prev.filter(d => d.id !== id));
  };

  const toggleDutyConfirmation = (dutyId: string, roleIndex: number) => {
    setDuties(prev => prev.map(d => {
      if (d.id !== dutyId) return d;
      const updatedRoles = [...d.roles];
      if (updatedRoles[roleIndex]) {
        updatedRoles[roleIndex] = {
          ...updatedRoles[roleIndex],
          confirmed: !updatedRoles[roleIndex].confirmed
        };
      }
      return { ...d, roles: updatedRoles };
    }));
  };

  // --- FINANCIAL TRANSACTION CRUD (Com salvamento no Supabase) ---
  const addTransaction = async (data: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = { ...data, id: `tx-${Date.now()}` };
    setTransactions(prev => [newTx, ...prev]);

    try {
      await supabase.from('financial_records').insert([{
        id: newTx.id,
        type: (newTx as any).type || 'outro',
        category: (newTx as any).category || null,
        amount: (newTx as any).amount || 0,
        date: (newTx as any).date || new Date().toISOString().split('T')[0],
        description: (newTx as any).description || null
      }]);
    } catch (err) {
      console.error('Erro ao salvar transação no Supabase:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await supabase.from('financial_records').delete().eq('id', id);
    } catch (err) {
      console.error('Erro ao excluir transação no Supabase:', err);
    }
  };

  // --- CHURCH PROFILE UPDATE (Com salvamento no Supabase) ---
  const updateChurchProfile = async (profile: ChurchProfile) => {
    setChurchProfile(profile);

    try {
      await supabase.from('church_settings').upsert({
        id: 'default_church',
        name: profile.name,
        pastor_name: (profile as any).pastorName || (profile as any).pastor || null,
        cnpj: (profile as any).cnpj || null,
        verse: (profile as any).verse || (profile as any).motto || null,
        pix_key: (profile as any).pixKey || null
      });
    } catch (err) {
      console.error('Erro ao salvar perfil no Supabase:', err);
    }
  };

  // Backup & Restore
  const exportBackup = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      churchProfile,
      members,
      departments,
      events,
      duties,
      transactions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_atos_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.churchProfile) setChurchProfile(data.churchProfile);
      if (Array.isArray(data.members)) setMembers(data.members);
      if (Array.isArray(data.departments)) setDepartments(data.departments);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (Array.isArray(data.duties)) setDuties(data.duties);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      return true;
    } catch (err) {
      console.error("Erro ao importar backup:", err);
      return false;
    }
  };

  const resetAllData = () => {
    setChurchProfile(initialChurchProfile);
    setMembers(initialMembers);
    setDepartments(initialDepartments);
    setEvents(initialEvents);
    setDuties(initialVolunteerDuties);
    setTransactions(initialTransactions);
  };

  const theme = getPlatformTheme(churchProfile.themeId, {
    primary: churchProfile.customPrimaryColor,
    accent: churchProfile.customAccentColor,
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryHex);
    root.style.setProperty('--color-primary-hover', theme.primaryHoverHex);
    root.style.setProperty('--color-accent', theme.accentHex);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLOR_MODE, colorMode);
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    setChurchProfile(prev => ({ ...prev, colorMode: mode }));
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  const setThemeId = (
    themeId: PlatformThemeId, 
    customColors?: { primary?: string; accent?: string }
  ) => {
    setChurchProfile(prev => ({
      ...prev,
      themeId,
      customPrimaryColor: customColors?.primary || prev.customPrimaryColor,
      customAccentColor: customColors?.accent || prev.customAccentColor,
    }));
  };

  return (
    <ChurchContext.Provider
      value={{
        activeTab,
        setActiveTab,
        adminRole,
        setAdminRole,
        churchProfile,
        updateChurchProfile,
        theme,
        setThemeId,
        colorMode,
        setColorMode,
        toggleColorMode,
        members,
        addMember,
        updateMember,
        deleteMember,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        duties,
        addDuty,
        updateDuty,
        deleteDuty,
        toggleDutyConfirmation,
        transactions,
        addTransaction,
        deleteTransaction,
        selectedMemberForCard,
        setSelectedMemberForCard,
        exportBackup,
        importBackup,
        resetAllData,
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurch deve ser usado dentro de um ChurchProvider');
  }
  return context;
};
