import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthCopy, type AuthMode } from './auth-copy';

type AuthFormPanelProps = {
  mode: AuthMode;
  email: string;
  password: string;
  loading: boolean;
  showPassword: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent) => void;
  onModeChange: (mode: AuthMode) => void;
  onPasswordRecovery: () => void;
  onTogglePassword: () => void;
};

export function AuthFormPanel({
  mode,
  email,
  password,
  loading,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onModeChange,
  onPasswordRecovery,
  onTogglePassword,
}: AuthFormPanelProps) {
  const copy = getAuthCopy(mode);

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{copy.modeLabel}</p>
          <h2 className="mt-2 text-3xl font-display font-bold tracking-tight">{copy.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode !== 'reset' && (
            <div>
              <Label className="text-xs text-muted-foreground">Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                className="mt-1 h-11 rounded-xl bg-secondary/30"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">{copy.passwordLabel}</Label>
              <button type="button" onClick={onTogglePassword} className="text-[11px] font-medium text-primary hover:underline">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <div className="relative mt-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                className="h-11 rounded-xl bg-secondary/30 pr-11"
                placeholder="********"
                autoComplete={copy.passwordAutocomplete}
                required
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" onClick={onPasswordRecovery} className="text-xs font-medium text-primary hover:underline">
                Olvide mi contrasena
              </button>
            </div>
          )}

          <Button type="submit" className="h-11 w-full rounded-xl" disabled={loading}>
            {loading ? 'Espera un momento...' : copy.submitLabel}
          </Button>
        </form>

        <div className="mt-5 text-center text-sm">
          {mode === 'login' ? (
            <button type="button" onClick={() => onModeChange('signup')} className="text-primary hover:underline">
              No tienes cuenta? Registrate
            </button>
          ) : mode === 'signup' ? (
            <button type="button" onClick={() => onModeChange('login')} className="text-primary hover:underline">
              Ya tienes cuenta? Inicia sesion
            </button>
          ) : (
            <button type="button" onClick={() => onModeChange('login')} className="text-primary hover:underline">
              Volver al inicio de sesion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
