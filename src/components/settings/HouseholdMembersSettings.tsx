import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import type { User } from '@/lib/types';

export function HouseholdMembersSettings({
  users,
  updateUser,
  addUser,
  deleteUser,
}: {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
}) {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Member');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const startEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditUserName(user.name);
    setEditUserRole(user.role);
  };

  const saveUser = () => {
    if (!editingUser || !editUserName.trim()) return;
    updateUser(editingUser, { name: editUserName.trim(), role: editUserRole.trim() });
    setEditingUser(null);
    toast.success('Member updated');
  };

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    addUser({ id: `u-${Date.now()}`, name: newUserName.trim(), role: newUserRole.trim() || 'Member' });
    setNewUserName('');
    setNewUserRole('Member');
    setShowAddUser(false);
    toast.success('Member added');
  };

  const confirmDeleteUser = () => {
    if (!deleteUserId) return;
    deleteUser(deleteUserId);
    setDeleteUserId(null);
    toast.success('Member removed');
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Household Members</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setShowAddUser(true)}>
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-4 bg-secondary/30 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary shrink-0">
              {user.name[0]}
            </div>
            {editingUser === user.id ? (
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                <Input value={editUserName} onChange={(event) => setEditUserName(event.target.value)} className="h-8 w-36 bg-secondary/50 text-sm" placeholder="Name" maxLength={30} />
                <Input value={editUserRole} onChange={(event) => setEditUserRole(event.target.value)} className="h-8 w-28 bg-secondary/50 text-sm" placeholder="Role" maxLength={20} />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveUser}>
                  <Check className="w-3.5 h-3.5 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingUser(null)}>
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEditUser(user)}>
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </Button>
                  {users.length > 1 && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteUserId(user.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {showAddUser && (
          <div className="flex items-center gap-3 bg-secondary/30 rounded-xl p-4 border border-primary/20">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <Input value={newUserName} onChange={(event) => setNewUserName(event.target.value)} className="h-8 w-36 bg-secondary/50 text-sm" placeholder="Name" maxLength={30} autoFocus />
            <Input value={newUserRole} onChange={(event) => setNewUserRole(event.target.value)} className="h-8 w-28 bg-secondary/50 text-sm" placeholder="Role" maxLength={20} />
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleAddUser}>
              <Check className="w-3.5 h-3.5 text-primary" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowAddUser(false)}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>

      <DeleteConfirmation
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Remove Member"
        description="This member will be removed from the household. Their existing expense records will remain."
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}
