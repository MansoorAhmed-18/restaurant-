export interface StaffUser {
  id?: string;
  name: string;
  username: string;
  role: "Manager" | "Cashier";
  email?: string;
  shift?: string;
}

export interface StaffAccount {
  id: string;
  username: string;
  name: string;
  role: "Manager" | "Cashier";
  password: string; // Plain/hashed password for POS access
  createdAt: string;
  createdBy?: string;
}

const STORAGE_ACCOUNTS_KEY = "res_pos_staff_accounts";
const STORAGE_SESSION_KEY = "pos_active_staff";
const STORAGE_TOKEN_KEY = "pos_auth_token";

// Default initial manager account if fresh install
const DEFAULT_INITIAL_ACCOUNTS: StaffAccount[] = [
  {
    id: "mgr_1",
    username: "manager",
    name: "Restaurant Manager",
    role: "Manager",
    password: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "csh_1",
    username: "cashier",
    name: "Front Cashier",
    role: "Cashier",
    password: "123",
    createdAt: new Date().toISOString(),
    createdBy: "manager",
  },
];

export function getRegisteredAccounts(): StaffAccount[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(DEFAULT_INITIAL_ACCOUNTS));
      return DEFAULT_INITIAL_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INITIAL_ACCOUNTS;
  }
}

export function saveRegisteredAccounts(accounts: StaffAccount[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error("Error saving staff accounts:", e);
  }
}

export function hasManagerAccount(): boolean {
  const accounts = getRegisteredAccounts();
  return accounts.some((a) => a.role === "Manager");
}

export function registerManager(name: string, username: string, password: string): { success: boolean; message?: string } {
  const trimmedUser = username.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedPass = password.trim();

  if (!trimmedName || !trimmedUser || !trimmedPass) {
    return { success: false, message: "All fields are required." };
  }

  const accounts = getRegisteredAccounts();
  const exists = accounts.find((a) => a.username.toLowerCase() === trimmedUser);
  if (exists) {
    return { success: false, message: `Username "${trimmedUser}" is already taken.` };
  }

  const newMgr: StaffAccount = {
    id: `mgr_${Date.now()}`,
    name: trimmedName,
    username: trimmedUser,
    role: "Manager",
    password: trimmedPass,
    createdAt: new Date().toISOString(),
  };

  const updated = [newMgr, ...accounts];
  saveRegisteredAccounts(updated);
  return { success: true };
}

export function addCashierAccount(name: string, username: string, password: string, createdByManager: string): { success: boolean; message?: string } {
  const trimmedUser = username.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedPass = password.trim();

  if (!trimmedName || !trimmedUser || !trimmedPass) {
    return { success: false, message: "Please fill in all cashier details." };
  }

  const accounts = getRegisteredAccounts();
  const exists = accounts.find((a) => a.username.toLowerCase() === trimmedUser);
  if (exists) {
    return { success: false, message: `Cashier ID/Username "${trimmedUser}" is already taken.` };
  }

  const newCashier: StaffAccount = {
    id: `csh_${Date.now()}`,
    name: trimmedName,
    username: trimmedUser,
    role: "Cashier",
    password: trimmedPass,
    createdAt: new Date().toISOString(),
    createdBy: createdByManager,
  };

  const updated = [...accounts, newCashier];
  saveRegisteredAccounts(updated);
  return { success: true };
}

export function removeStaffAccount(id: string): { success: boolean; message?: string } {
  const accounts = getRegisteredAccounts();
  const target = accounts.find((a) => a.id === id);
  if (!target) return { success: false, message: "Account not found." };
  
  // Don't remove if it's the only manager
  if (target.role === "Manager") {
    const managers = accounts.filter((a) => a.role === "Manager");
    if (managers.length <= 1) {
      return { success: false, message: "Cannot delete the only Manager account." };
    }
  }

  const updated = accounts.filter((a) => a.id !== id);
  saveRegisteredAccounts(updated);
  return { success: true };
}

export function authenticate(username: string, password: string): { success: boolean; staff?: StaffUser; message?: string } {
  const trimmedUser = username.trim().toLowerCase();
  const trimmedPass = password.trim();

  if (!trimmedUser || !trimmedPass) {
    return { success: false, message: "Please enter both Username and Password." };
  }

  const accounts = getRegisteredAccounts();
  const match = accounts.find((a) => a.username.toLowerCase() === trimmedUser && a.password === trimmedPass);

  if (!match) {
    return { success: false, message: "Invalid Username/ID or Password. Access denied." };
  }

  const staffUser: StaffUser = {
    id: match.id,
    name: match.name,
    username: match.username,
    role: match.role,
    shift: "Active Shift",
  };

  // Generate auth session token
  if (typeof window !== "undefined") {
    const token = `auth_${match.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(staffUser));
  }

  return { success: true, staff: staffUser };
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const staff = localStorage.getItem(STORAGE_SESSION_KEY);
    return Boolean(token && staff);
  } catch {
    return false;
  }
}

export function getActiveStaff(): StaffUser | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_SESSION_KEY);
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (saved && token) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading staff session:", e);
  }
  return null;
}

export function setActiveStaff(staff: StaffUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(staff));
    if (!localStorage.getItem(STORAGE_TOKEN_KEY)) {
      localStorage.setItem(STORAGE_TOKEN_KEY, `auth_${Date.now()}`);
    }
  } catch (e) {
    console.error("Error saving staff session:", e);
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (e) {
    console.error("Error logging out:", e);
  }
}

export function getStaffInitials(name: string): string {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
