import { useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import type { WeeklyExpense } from '@/lib/types';
import { ExpenseForm } from './ExpenseForm';
import { WeekCardSummary, WeekExpenseTable } from './week-card';

interface WeekCardProps {
  week: number;
  weeklyIncome: number;
  expenses: WeeklyExpense[];
  extraIncome: number;
  dueDate: string;
  onExtraIncomeChange: (v: number) => void;
  onStatusChange: (id: string, status: WeeklyExpense['status']) => void;
  onUpdateExpense: (id: string, updates: Partial<WeeklyExpense>) => void;
  onDeleteExpense: (id: string) => void;
}

export function WeekCard({
  week,
  weeklyIncome,
  expenses,
  extraIncome,
  dueDate,
  onExtraIncomeChange,
  onStatusChange,
  onUpdateExpense,
  onDeleteExpense,
}: WeekCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeeklyExpense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = weeklyIncome + extraIncome - totalExpenses;
  const paidCount = expenses.filter((expense) => expense.status === 'Paid').length;
  const pendingCount = expenses.length - paidCount;

  const handleSave = (data: Omit<WeeklyExpense, 'id'>) => {
    if (editingExpense) {
      onUpdateExpense(editingExpense.id, data);
      toast.success('Expense updated');
    }
    setEditingExpense(null);
  };

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
        <WeekCardSummary
          week={week}
          weeklyIncome={weeklyIncome}
          extraIncome={extraIncome}
          totalExpenses={totalExpenses}
          remaining={remaining}
          dueDate={dueDate}
          paidCount={paidCount}
          pendingCount={pendingCount}
          onExtraIncomeChange={onExtraIncomeChange}
        />
        <WeekExpenseTable
          expenses={expenses}
          totalExpenses={totalExpenses}
          onStatusChange={onStatusChange}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setShowForm(true);
          }}
          onDelete={setDeleteId}
        />
      </div>

      <ExpenseForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingExpense(null);
        }}
        onSave={handleSave}
        initialData={editingExpense}
        weekNumber={week}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Expense"
        description="This will permanently remove this expense from the weekly planner."
        onConfirm={() => {
          if (deleteId) {
            onDeleteExpense(deleteId);
            toast.success('Expense deleted');
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}
