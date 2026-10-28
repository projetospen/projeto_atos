import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Member, 
  Department, 
  ChurchEvent, 
  VolunteerDuty, 
  FinancialTransaction, 
  ChurchProfile,
  ChurchModulesConfig,
  RoleModulesConfig,
  DEFAULT_CHURCH_MODULES,
  DEFAULT_ROLE_MODULES,
  DEFAULT_ROLE_DEFINITIONS,
  RoleDefinition,
  PlatformTheme,
  PlatformThemeId,
  ColorMode,
  UserAccount,
  AdminRole,
  NavTab,
  ROLE_PERMISSIONS,
  isTabAllowed,
  isAdminRole,
  isModuleActiveForRole,
  getRoleModuleConfig
} from '../types';
import { getPlatformTheme } from '../data/themeConfig';
import { 
  initialMembers, 
  initialDepartments, 
  initialEvents, 
  initialVolunteerDuties, 
  initialTransactions, 
  initialChurchProfile,
  defaultAccounts
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type { AdminRole, UserAccount, NavTab, ChurchModulesConfig, RoleModulesConfig, RoleDefinition } from '../types';
export { ROLE_PERMISSIONS, isTabAllowed, isAdminRole, isModuleActiveForRole, getRoleModuleConfig, DEFAULT_ROLE_DEFINITIONS } from '../types';

interface ChurchContextType {
  // Navigation & Role
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  isTabAllowed: (tab: NavTab, targetRole?: AdminRole) => boolean;
  isAdmin: boolean;
  isSupabaseConnected: boolean;

  // Roles & Permissions Management
  roles: RoleDefinition[];
  addRole: (role: Omit<RoleDefinition, 'id'>) => RoleDefinition;
  updateRole: (roleId: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (roleId: string) => { success: boolean; message?: string };
  resetRolesToDefault: () => void;
  getRoleDefinition: (roleNameOrId: string) => RoleDefinition | undefined;

  // Authentication & Current User
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  availableAccounts: UserAccount[];
  login: (email: string, password?: string, targetAccount?: UserAccount) => Promise<boolean>;
  logout: () => Promise<void>;
  updateCurrentUser: (updates: Partial<UserAccount>) => void;
  
  // Data & Branding & Modules
  churchProfile: ChurchProfile;
  updateChurchProfile: (profile: ChurchProfile) => void;
  toggleModule: (moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => void;
  toggleRoleModule: (role: AdminRole, moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => void;
  setRoleModules: (role: AdminRole, modules: ChurchModulesConfig) => void;
  resetRoleModules: (role?: AdminRole) => void;
  uploadChurchIcon: (imageUrl: string) => void;
  theme: PlatformTheme;
  setThemeId: (themeId: PlatformThemeId, customColors?: { primary?: string; accent?: string }) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  
  // Theme Modal Trigger
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  
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

  // Digital Card modal trigger
  selectedMemberForCard: Member | null;
  setSelectedMemberForCard: (member: Member | null) => void;

  // Data management
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
  AUTH_USER: 'atos_auth_user_v1',
  ACCOUNTS: 'atos_accounts_v2',
  USER_THEMES: 'atos_user_themes_map_v2',
  CUSTOM_ROLES: 'atos_custom_roles_v2',
};

// Per-profile theme storage helper
const getStoredUserTheme = (userId: string) => {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_THEMES) || '{}');
    return map[userId] || null;
  } catch {
    return null;
  }
};

const saveStoredUserTheme = (userId: string, data: {
  themeId?: PlatformThemeId;
  customPrimaryColor?: string;
  customAccentColor?: string;
  colorMode?: ColorMode;
}) => {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_THEMES) || '{}');
    map[userId] = { ...map[userId], ...data };
    localStorage.setItem(STORAGE_KEYS.USER_THEMES, JSON.stringify(map));
  } catch (e) {
    console.error(e);
  }
};

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableAccounts, setAvailableAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return defaultAccounts;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved === 'logged_out') return null;
    if (saved) {
      try { 
        const user: UserAccount = JSON.parse(saved);
        const storedTheme = getStoredUserTheme(user.id);
        return storedTheme ? { ...user, ...storedTheme } : user;
      } catch (e) { console.error(e); }
    }
    const initialUser = defaultAccounts[0]; // Pr. Marcos Vinicius
    const storedTheme = getStoredUserTheme(initialUser.id);
    return storedTheme ? { ...initialUser, ...storedTheme } : initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return saved !== 'logged_out';
  });

  const [adminRole, setAdminRoleState] = useState<AdminRole>(() => {
    return currentUser?.role || (localStorage.getItem(STORAGE_KEYS.ROLE) as AdminRole) || 'Pastor Presidente';
  });

  const [activeTab, setActiveTabState] = useState<NavTab>(() => {
    const role = currentUser?.role || 'Pastor Presidente';
    return ROLE_PERMISSIONS[role]?.defaultTab || 'dashboard';
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROLES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return DEFAULT_ROLE_DEFINITIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ROLES, JSON.stringify(roles));
  }, [roles]);

  const [churchProfile, setChurchProfile] = useState<ChurchProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          ...initialChurchProfile,
          ...parsed,
          enabledModules: {
            ...DEFAULT_CHURCH_MODULES,
            ...(parsed?.enabledModules || {})
          },
          roleModulesConfig: {
            ...DEFAULT_ROLE_MODULES,
            ...(parsed?.roleModulesConfig || {})
          },
          customRoles: parsed?.customRoles || DEFAULT_ROLE_DEFINITIONS
        };
      } catch (e) { console.error(e); }
    }
    return initialChurchProfile;
  });

  const activeUserRole = currentUser?.role || adminRole;
  const isAdmin = isAdminRole(activeUserRole, roles);

  const getRoleDefinition = (roleNameOrId: string): RoleDefinition | undefined => {
    return roles.find(r => r.name === roleNameOrId || r.id === roleNameOrId);
  };

  const checkIsTabAllowed = (tab: NavTab, targetRole?: AdminRole): boolean => {
    const role = targetRole || currentUser?.role || adminRole;
    return isTabAllowed(role, tab, churchProfile, roles);
  };

  const setActiveTab = (tab: NavTab) => {
    if (checkIsTabAllowed(tab)) {
      setActiveTabState(tab);
    } else {
      const role = currentUser?.role || adminRole;
      const roleDef = getRoleDefinition(role);
      const fallback = roleDef?.defaultTab || (ROLE_PERMISSIONS as any)[role]?.defaultTab || 'membros';
      setActiveTabState(checkIsTabAllowed(fallback) ? fallback : 'membros');
    }
  };

  // Auto fallback to 'membros' if current active tab is not allowed for this profile or church
  useEffect(() => {
    if (!checkIsTabAllowed(activeTab)) {
      const role = currentUser?.role || adminRole;
      const roleDef = getRoleDefinition(role);
      const defaultTab = roleDef?.defaultTab || (ROLE_PERMISSIONS as any)[role]?.defaultTab || 'membros';
      setActiveTabState(checkIsTabAllowed(defaultTab) ? defaultTab : 'membros');
    }
  }, [churchProfile?.enabledModules, churchProfile?.roleModulesConfig, activeTab, currentUser?.role, adminRole, roles]);

  const setAdminRole = (role: AdminRole) => {
    setAdminRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    let departmentId = currentUser?.departmentId;
    let departmentName = currentUser?.departmentName;
    if (role === 'Líder de Ministério' && !departmentId) {
      departmentId = 'dep-1';
      departmentName = 'Ministério de Louvor & Adoração';
    }
    if (currentUser) {
      const updated: UserAccount = { ...currentUser, role, departmentId, departmentName };
      setCurrentUser(updated);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));
    }
    if (!checkIsTabAllowed(activeTab)) {
      const roleDef = getRoleDefinition(role);
      setActiveTabState(roleDef?.defaultTab || (ROLE_PERMISSIONS as any)[role]?.defaultTab || 'membros');
    }
  };

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
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);

  const openThemeModal = () => setIsThemeModalOpen(true);
  const closeThemeModal = () => setIsThemeModalOpen(false);

  // Supabase Initial Data Sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    async function loadFromSupabase() {
      try {
        const { data: profileData, error: profileErr } = await supabase!
          .from('church_profile')
          .select('*')
          .single();

        if (profileData && !profileErr && isMounted) {
          setChurchProfile(prev => ({ ...prev, ...profileData }));
        }

        const { data: membersData, error: membersErr } = await supabase!
          .from('members')
          .select('*');

        if (membersData && !membersErr && membersData.length > 0 && isMounted) {
          setMembers(membersData);
        }

        const { data: deptsData, error: deptsErr } = await supabase!
          .from('departments')
          .select('*');

        if (deptsData && !deptsErr && deptsData.length > 0 && isMounted) {
          setDepartments(deptsData);
        }

        if (isMounted) setIsSupabaseConnected(true);
      } catch (err) {
        console.warn('Supabase: utilizando dados locais como fallback.', err);
      }
    }

    loadFromSupabase();
    return () => { isMounted = false; };
  }, []);

  // Sync to LocalStorage & Supabase (when configured)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(churchProfile));
    if (isSupabaseConfigured && supabase) {
      supabase.from('church_profile').upsert({ id: 'primary', ...churchProfile }).then(({ error }) => {
        if (error) console.warn('Supabase sync warning:', error.message);
      });
    }
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

  // Authentication & Session Management
  const login = async (email: string, password?: string, targetAccount?: UserAccount): Promise<boolean> => {
    let userToSet: UserAccount;
    if (targetAccount) {
      userToSet = targetAccount;
    } else {
      const matched = availableAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (matched) {
        userToSet = matched;
      } else {
        const rawName = email.split('@')[0];
        const formattedName = rawName
          .split(/[._-]/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        userToSet = {
          id: `usr-${Date.now()}`,
          name: formattedName || 'Membro Administrativo',
          email: email.trim(),
          role: 'Administrador Geral',
          themeId: 'dourado_real',
          colorMode: 'light'
        };
      }
    }

    // Merge any stored personal theme preference for this profile ID
    const personalTheme = getStoredUserTheme(userToSet.id);
    if (personalTheme) {
      userToSet = { ...userToSet, ...personalTheme };
    }

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          userToSet = {
            id: data.user.id,
            name: data.user.user_metadata?.name || userToSet.name,
            email: data.user.email || email,
            role: (data.user.user_metadata?.role as AdminRole) || userToSet.role,
            themeId: userToSet.themeId,
            colorMode: userToSet.colorMode
          };
        }
      } catch (err) {
        console.warn('Supabase signIn: autenticando em modo local', err);
      }
    }

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    setAdminRoleState(userToSet.role);
    localStorage.setItem(STORAGE_KEYS.ROLE, userToSet.role);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userToSet));

    // Instantly activate this user's individual colorMode
    if (userToSet.colorMode) {
      setColorModeState(userToSet.colorMode);
    }

    // Ensure tab switches to allowed default tab for this profile
    if (!isTabAllowed(userToSet.role, activeTab, churchProfile)) {
      const defaultTab = ROLE_PERMISSIONS[userToSet.role]?.defaultTab || 'membros';
      setActiveTabState(isTabAllowed(userToSet.role, defaultTab, churchProfile) ? defaultTab : 'membros');
    }
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, 'logged_out');
    // Revert to dark mode for login portal
    setColorModeState('dark');
  };

  const updateCurrentUser = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));

    setAvailableAccounts(prev => {
      const next = prev.map(acc => acc.id === currentUser.id ? updated : acc);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
      return next;
    });

    if (updates.themeId || updates.customPrimaryColor || updates.customAccentColor || updates.colorMode) {
      saveStoredUserTheme(currentUser.id, {
        themeId: updates.themeId || currentUser.themeId,
        customPrimaryColor: updates.customPrimaryColor || currentUser.customPrimaryColor,
        customAccentColor: updates.customAccentColor || currentUser.customAccentColor,
        colorMode: updates.colorMode || currentUser.colorMode,
      });
    }
  };

  const uploadChurchIcon = (imageUrl: string) => {
    setChurchProfile(prev => ({
      ...prev,
      logoUrl: imageUrl,
      emblem: {
        type: 'image',
        imageUrl,
        gradient: prev.emblem?.gradient || 'from-amber-500 to-amber-300',
        shape: prev.emblem?.shape || 'rounded',
      }
    }));
  };

  // Member CRUD
  const addMember = async (data: Omit<Member, 'id' | 'createdAt'>) => {
  const newMember: Member = {
    ...data,
    id: `mem-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  setMembers(prev => [newMember, ...prev]);

    try {
      if (supabase) {
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
          console.error('Erro no Supabase:', error.message);
        }
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  };

  const updateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Department CRUD
  const addDepartment = (data: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...data,
      id: `dep-${Date.now()}`
    };
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
    const newEvent: ChurchEvent = {
      ...data,
      id: `evt-${Date.now()}`
    };
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
    const newDuty: VolunteerDuty = {
      ...data,
      id: `duty-${Date.now()}`
    };
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

  // Transaction CRUD
  const addTransaction = (data: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...data,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateChurchProfile = (profile: ChurchProfile) => {
    setChurchProfile(profile);
  };

  const toggleModule = (moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => {
    setChurchProfile(prev => {
      const currentModules = prev.enabledModules || DEFAULT_CHURCH_MODULES;
      const nextVal = enabled !== undefined ? enabled : !currentModules[moduleKey];
      return {
        ...prev,
        enabledModules: {
          ...currentModules,
          [moduleKey]: nextVal,
        }
      };
    });
  };

  const toggleRoleModule = (role: AdminRole, moduleKey: keyof ChurchModulesConfig, enabled?: boolean) => {
    setChurchProfile(prev => {
      const currentRoleConfigs = prev.roleModulesConfig || DEFAULT_ROLE_MODULES;
      const currentRoleMod = currentRoleConfigs[role] || DEFAULT_ROLE_MODULES[role] || DEFAULT_CHURCH_MODULES;
      const nextVal = enabled !== undefined ? enabled : !currentRoleMod[moduleKey];
      return {
        ...prev,
        roleModulesConfig: {
          ...currentRoleConfigs,
          [role]: {
            ...currentRoleMod,
            [moduleKey]: nextVal,
          }
        }
      };
    });
    setRoles(prevRoles => prevRoles.map(r => {
      if (r.name === role || r.id === role) {
        return {
          ...r,
          modules: {
            ...r.modules,
            [moduleKey]: enabled !== undefined ? enabled : !r.modules[moduleKey]
          }
        };
      }
      return r;
    }));
  };

  const setRoleModules = (role: AdminRole, modules: ChurchModulesConfig) => {
    setChurchProfile(prev => ({
      ...prev,
      roleModulesConfig: {
        ...(prev.roleModulesConfig || DEFAULT_ROLE_MODULES),
        [role]: modules,
      }
    }));
    setRoles(prevRoles => prevRoles.map(r => {
      if (r.name === role || r.id === role) {
        return { ...r, modules };
      }
      return r;
    }));
  };

  const resetRoleModules = (role?: AdminRole) => {
    setChurchProfile(prev => {
      if (role) {
        const def = roles.find(r => r.name === role || r.id === role);
        return {
          ...prev,
          roleModulesConfig: {
            ...(prev.roleModulesConfig || DEFAULT_ROLE_MODULES),
            [role]: def ? { ...def.modules } : { ...DEFAULT_ROLE_MODULES[role] },
          }
        };
      }
      return {
        ...prev,
        roleModulesConfig: { ...DEFAULT_ROLE_MODULES }
      };
    });
  };

  // Custom Roles Management
  const addRole = (newRoleData: Omit<RoleDefinition, 'id'>): RoleDefinition => {
    const newId = `role-${Date.now()}`;
    const newRole: RoleDefinition = {
      ...newRoleData,
      id: newId,
      isSystem: false,
    };

    setRoles(prev => [...prev, newRole]);
    setChurchProfile(prev => ({
      ...prev,
      customRoles: [...(prev.customRoles || DEFAULT_ROLE_DEFINITIONS), newRole],
      roleModulesConfig: {
        ...(prev.roleModulesConfig || DEFAULT_ROLE_MODULES),
        [newRole.name]: newRole.modules,
      }
    }));
    return newRole;
  };

  const updateRole = (roleId: string, updates: Partial<RoleDefinition>) => {
    setRoles(prevRoles => {
      const oldRole = prevRoles.find(r => r.id === roleId);
      if (!oldRole) return prevRoles;

      const updatedRole: RoleDefinition = { ...oldRole, ...updates };

      // If name changed, update accounts, currentUser and roleModulesConfig
      if (updates.name && updates.name !== oldRole.name) {
        const oldName = oldRole.name;
        const newName = updates.name;

        setAvailableAccounts(prevAccs => {
          const updatedAccs = prevAccs.map(acc => acc.role === oldName ? { ...acc, role: newName } : acc);
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccs));
          return updatedAccs;
        });

        if (currentUser && currentUser.role === oldName) {
          const updatedUser: UserAccount = { ...currentUser, role: newName };
          setCurrentUser(updatedUser);
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
        }

        setChurchProfile(prevProfile => {
          const currentConfigs = prevProfile.roleModulesConfig || DEFAULT_ROLE_MODULES;
          const roleConfig = currentConfigs[oldName] || updatedRole.modules;
          const { [oldName]: _, ...rest } = currentConfigs;
          return {
            ...prevProfile,
            roleModulesConfig: {
              ...rest,
              [newName]: roleConfig
            }
          };
        });
      }

      if (updates.modules) {
        setChurchProfile(prevProfile => ({
          ...prevProfile,
          roleModulesConfig: {
            ...(prevProfile.roleModulesConfig || DEFAULT_ROLE_MODULES),
            [updatedRole.name]: updates.modules!,
          }
        }));
      }

      const nextRoles = prevRoles.map(r => r.id === roleId ? updatedRole : r);
      setChurchProfile(prevProfile => ({
        ...prevProfile,
        customRoles: nextRoles
      }));
      return nextRoles;
    });
  };

  const deleteRole = (roleId: string): { success: boolean; message?: string } => {
    const roleToDelete = roles.find(r => r.id === roleId);
    if (!roleToDelete) {
      return { success: false, message: 'Perfil não encontrado.' };
    }

    if (roleToDelete.isSystem || roleToDelete.name === 'Pastor Presidente' || roleToDelete.name === 'Administrador Geral') {
      return { success: false, message: 'Perfis de sistema essenciais não podem ser excluídos.' };
    }

    const boundAccounts = availableAccounts.filter(acc => acc.role === roleToDelete.name);
    if (boundAccounts.length > 0) {
      return { 
        success: false, 
        message: `Não é possível excluir este perfil porque existem ${boundAccounts.length} conta(s) vinculada(s) a ele (${boundAccounts.map(a => a.name).join(', ')}). Altere o perfil dessas contas antes de excluir.` 
      };
    }

    if (currentUser?.role === roleToDelete.name) {
      return {
        success: false,
        message: 'Você não pode excluir o perfil com o qual está conectado no momento.'
      };
    }

    setRoles(prevRoles => {
      const nextRoles = prevRoles.filter(r => r.id !== roleId);
      setChurchProfile(prevProfile => {
        const { [roleToDelete.name]: _, ...restConfigs } = prevProfile.roleModulesConfig || {};
        return {
          ...prevProfile,
          customRoles: nextRoles,
          roleModulesConfig: restConfigs as any,
        };
      });
      return nextRoles;
    });

    return { success: true };
  };

  const resetRolesToDefault = () => {
    setRoles(DEFAULT_ROLE_DEFINITIONS);
    setChurchProfile(prev => ({
      ...prev,
      customRoles: DEFAULT_ROLE_DEFINITIONS,
      roleModulesConfig: DEFAULT_ROLE_MODULES,
    }));
  };

  // Backup & Restore
  const exportBackup = () => {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      churchProfile,
      roles,
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
      if (Array.isArray(data.roles)) setRoles(data.roles);
      else if (data.churchProfile?.customRoles) setRoles(data.churchProfile.customRoles);
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

  const activeThemeId = currentUser?.themeId || churchProfile.themeId || 'dourado_real';
  const activeCustomColors = {
    primary: currentUser?.customPrimaryColor || churchProfile.customPrimaryColor,
    accent: currentUser?.customAccentColor || churchProfile.customAccentColor,
  };

  const theme = getPlatformTheme(activeThemeId, activeCustomColors);

  // Apply CSS variables dynamically to :root for fluid theme transitions
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryHex);
    root.style.setProperty('--color-primary-hover', theme.primaryHoverHex);
    root.style.setProperty('--color-accent', theme.accentHex);

    // Apply palette-specific dark mode colors
    if (theme.darkModeConfig) {
      root.style.setProperty('--theme-dark-bg-base', theme.darkModeConfig.bgBase);
      root.style.setProperty('--theme-dark-bg-card', theme.darkModeConfig.bgCard);
      root.style.setProperty('--theme-dark-bg-surface', theme.darkModeConfig.bgSurface);
      root.style.setProperty('--theme-dark-border', theme.darkModeConfig.borderColor);
      root.style.setProperty('--theme-dark-border-subtle', theme.darkModeConfig.borderSubtle);
      root.style.setProperty('--theme-dark-glow', theme.darkModeConfig.glowColor);
    }
  }, [theme]);

  // Synchronize colorMode class on <html> element
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
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        colorMode: mode,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));

      setAvailableAccounts(prev => {
        const next = prev.map(acc => acc.id === currentUser.id ? updatedUser : acc);
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
        return next;
      });

      saveStoredUserTheme(currentUser.id, { colorMode: mode });
    }
    setChurchProfile(prev => ({ ...prev, colorMode: mode }));
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  const setThemeId = (
    themeId: PlatformThemeId, 
    customColors?: { primary?: string; accent?: string }
  ) => {
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        themeId,
        customPrimaryColor: customColors?.primary ?? currentUser.customPrimaryColor,
        customAccentColor: customColors?.accent ?? currentUser.customAccentColor,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));

      setAvailableAccounts(prev => {
        const next = prev.map(acc => acc.id === currentUser.id ? updatedUser : acc);
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
        return next;
      });

      saveStoredUserTheme(currentUser.id, {
        themeId,
        customPrimaryColor: customColors?.primary ?? currentUser.customPrimaryColor,
        customAccentColor: customColors?.accent ?? currentUser.customAccentColor,
      });
    }

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
        isTabAllowed: checkIsTabAllowed,
        isAdmin,
        isSupabaseConnected,
        roles,
        addRole,
        updateRole,
        deleteRole,
        resetRolesToDefault,
        getRoleDefinition,
        currentUser,
        isAuthenticated,
        availableAccounts,
        login,
        logout,
        updateCurrentUser,
        churchProfile,
        updateChurchProfile,
        toggleModule,
        toggleRoleModule,
        setRoleModules,
        resetRoleModules,
        uploadChurchIcon,
        theme,
        setThemeId,
        colorMode,
        setColorMode,
        toggleColorMode,
        isThemeModalOpen,
        setIsThemeModalOpen,
        openThemeModal,
        closeThemeModal,
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
