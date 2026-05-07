import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthFormPanel, AuthVisualPanel, type AuthMode } from '@/components/auth';
import { supabase } from '@/integrations/supabase/client';
import { assetPath } from '@/lib/asset-path';

export default function AuthPage() {
  const authPhoto = assetPath('auth-photo.jpeg');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        toast.info('Puedes escribir tu nueva contrasena ahora.');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handlePasswordRecovery() {
    if (!email.trim()) {
      toast.error('Escribe tu correo primero para enviarte el enlace.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;
      toast.success('Te enviamos un enlace para restablecer tu contrasena.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo enviar el correo de recuperacion.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Sesion iniciada correctamente.');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Cuenta creada. Revisa tu correo si la confirmacion esta habilitada.');
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success('Contrasena actualizada.');
        setPassword('');
        setMode('login');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo completar la autenticacion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="dashboard-surface grid w-full overflow-hidden lg:grid-cols-[1.05fr_minmax(340px,0.95fr)]">
          <AuthVisualPanel authPhoto={authPhoto} />
          <AuthFormPanel
            mode={mode}
            email={email}
            password={password}
            loading={loading}
            showPassword={showPassword}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            onModeChange={setMode}
            onPasswordRecovery={handlePasswordRecovery}
            onTogglePassword={() => setShowPassword((current) => !current)}
          />
        </div>
      </div>
    </div>
  );
}
