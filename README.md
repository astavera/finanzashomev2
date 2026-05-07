# FinanzasHome

Aplicacion de finanzas personales y del hogar construida con React, Vite, Electron y Supabase.

## Desarrollo

```powershell
npm install
npm run dev
```

Para correr con Electron:

```powershell
npm run electron:dev
```

## Build

```powershell
npm run build
npm run electron:build
```

## Deploy Web

Para subirlo como web en Vercel:

```powershell
npm install
npm run build
```

Configura estas variables en Vercel:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

Valores recomendados en Vercel:

- Build command: `npm run build`
- Output directory: `dist`

Este proyecto usa `HashRouter`, asi que no necesita reglas extra de rewrites para rutas internas.

## Supabase

La app usa Supabase para autenticacion, datos del hogar, tarjetas, gastos, proyectos y configuracion financiera.

La integracion bancaria externa fue retirada. La migracion `20260506120000_drop_unused_bank_integrations.sql` elimina tablas antiguas de conexiones bancarias si existen en una base previa.

## Stack

- React + TypeScript
- Vite
- Electron
- Supabase
- React Query
