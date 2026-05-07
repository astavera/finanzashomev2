import {
  ArrowLeftRight,
  CalendarDays,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  RefreshCw,
  ReceiptText,
  Settings,
  WalletCards,
} from 'lucide-react';

export const appNavItems = [
  { title: 'Dashboard', shortTitle: 'Home', url: '/', icon: LayoutDashboard, group: 'main' },
  { title: 'Weekly Planner', shortTitle: 'Planner', url: '/planner', icon: CalendarDays, group: 'main' },
  { title: 'Gastos fijos', shortTitle: 'Fijos', url: '/fixed-expenses', icon: ReceiptText, group: 'main' },
  { title: 'Credit Cards', shortTitle: 'Cards', url: '/cards', icon: CreditCard, group: 'main' },
  { title: 'Wallet', shortTitle: 'Wallet', url: '/wallet', icon: WalletCards, group: 'main' },
  { title: 'Transactions', shortTitle: 'History', url: '/transactions', icon: ArrowLeftRight, group: 'money' },
  { title: 'Projects', shortTitle: 'Goals', url: '/projects', icon: FolderKanban, group: 'money' },
  { title: 'Exchange Rate', shortTitle: 'Rate', url: '/exchange', icon: RefreshCw, group: 'money' },
  { title: 'Settings', shortTitle: 'Settings', url: '/settings', icon: Settings, group: 'system' },
] as const;

export const topNavItems = appNavItems.filter((item) =>
  ['/', '/planner', '/fixed-expenses', '/cards', '/wallet', '/projects'].includes(item.url),
);

export const settingsNavItems = appNavItems.filter((item) =>
  ['/transactions', '/exchange', '/settings'].includes(item.url),
);

export const mobileNavItems = appNavItems.filter((item) =>
  ['/', '/planner', '/fixed-expenses', '/cards', '/settings'].includes(item.url),
);

export function getNavTitle(pathname: string) {
  return appNavItems.find((item) => item.url === pathname)?.title ?? 'Finanzas Hogar';
}
