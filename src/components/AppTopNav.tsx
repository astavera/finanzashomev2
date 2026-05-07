import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavLink } from '@/components/NavLink';
import { getNavTitle, settingsNavItems, topNavItems } from '@/lib/navigation';

export function AppTopNav() {
  const location = useLocation();
  const activeTitle = getNavTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 px-3 py-2 backdrop-blur-xl md:px-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="min-w-0 shrink-0 rounded-xl px-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Home</p>
          <p className="truncate font-display text-base font-semibold tracking-tight">{activeTitle}</p>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 rounded-2xl border border-border/60 bg-secondary/25 p-1 md:flex">
          {topNavItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === '/'}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/75 hover:text-foreground"
              activeClassName="bg-background text-foreground shadow-sm"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.shortTitle}</span>
            </NavLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/75 hover:text-foreground">
              Settings
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 border-border bg-card">
              {settingsNavItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link to={item.url} className="flex cursor-pointer items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/wallet"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Compra</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden">
              Settings
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 border-border bg-card">
              {[...topNavItems, ...settingsNavItems].map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link to={item.url} className="flex cursor-pointer items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
