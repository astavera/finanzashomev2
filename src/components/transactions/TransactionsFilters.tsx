import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { TransactionFilters } from './transactions-history-utils';

type TransactionsFiltersProps = {
  categories: string[];
  filters: TransactionFilters;
  onChange: (updates: Partial<TransactionFilters>) => void;
};

export function TransactionsFilters({ categories, filters, onChange }: TransactionsFiltersProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            className="w-48 h-8 text-xs bg-secondary/30 pl-8"
          />
        </div>

        <select
          value={filters.week}
          onChange={(event) => onChange({ week: event.target.value })}
          className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="all">All Weeks</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
        </select>

        <select
          value={filters.paidBy}
          onChange={(event) => onChange({ paidBy: event.target.value })}
          className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="all">All Members</option>
          <option value="Sebas">Sebas</option>
          <option value="Sharon">Sharon</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
          className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.currency}
          onChange={(event) => onChange({ currency: event.target.value })}
          className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs"
        >
          <option value="all">All Currencies</option>
          <option value="USD">USD</option>
          <option value="COP">COP</option>
        </select>

        <button
          onClick={() => onChange({ sortDesc: !filters.sortDesc })}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-secondary/30"
        >
          {filters.sortDesc ? 'Newest first' : 'Oldest first'}
        </button>
      </div>
    </div>
  );
}
