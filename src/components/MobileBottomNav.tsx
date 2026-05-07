import { NavLink } from '@/components/NavLink';
import { mobileNavItems } from '@/lib/navigation';

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[24px] border border-border/70 bg-background/90 px-2 py-2 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.7)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/'}
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.shortTitle}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
