export interface StaffUser {
  name: string;
  role: "Cashier" | "Manager" | "Kitchen Admin";
  email?: string;
  shift?: string;
}

const DEFAULT_STAFF: StaffUser = {
  name: "Mansoor Ahmed",
  role: "Manager",
  email: "mansoor@spiceroute.in",
  shift: "Morning Shift",
};

export function getActiveStaff(): StaffUser {
  if (typeof window === "undefined") return DEFAULT_STAFF;
  try {
    const saved = localStorage.getItem("pos_active_staff");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading staff session:", e);
  }
  return DEFAULT_STAFF;
}

export function setActiveStaff(staff: StaffUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("pos_active_staff", JSON.stringify(staff));
  } catch (e) {
    console.error("Error saving staff session:", e);
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
