export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

export type Role = 'patient' | 'doctor' | 'admin';
