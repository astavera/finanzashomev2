export type AuthMode = 'login' | 'signup' | 'reset';

export function getAuthCopy(mode: AuthMode) {
  if (mode === 'signup') {
    return {
      modeLabel: 'Nueva cuenta',
      title: 'Crea tu cuenta',
      subtitle: 'Crea tu cuenta para comenzar.',
      submitLabel: 'Crear cuenta',
      passwordLabel: 'Contrasena',
      passwordAutocomplete: 'new-password',
    };
  }

  if (mode === 'reset') {
    return {
      modeLabel: 'Recuperacion',
      title: 'Cambia tu contrasena',
      subtitle: 'Escribe una nueva contrasena para tu cuenta.',
      submitLabel: 'Guardar nueva contrasena',
      passwordLabel: 'Nueva contrasena',
      passwordAutocomplete: 'new-password',
    };
  }

  return {
    modeLabel: 'Bienvenido',
    title: 'Accede a tu panel',
    subtitle: 'Ingresa para continuar.',
    submitLabel: 'Entrar',
    passwordLabel: 'Contrasena',
    passwordAutocomplete: 'current-password',
  };
}
