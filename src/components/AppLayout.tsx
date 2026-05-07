import { AppTopNav } from '@/components/AppTopNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { assetPath } from '@/lib/asset-path';
import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const cornerVideo = assetPath('corner-video.mp4');

  return (
    <div className="min-h-screen w-full">
      <AppTopNav />
      <main className="min-h-[calc(100vh-57px)] overflow-auto p-4 pb-24 md:p-6 lg:pb-6">
        {children}
      </main>
      <MobileBottomNav />
      <div className="pointer-events-none fixed bottom-4 left-4 z-20 hidden items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.32))] shadow-[0_20px_56px_-36px_rgba(15,23,42,0.7)] backdrop-blur-sm sm:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,rgba(16,185,129,0.08),transparent_45%,rgba(15,23,42,0.18))]" />
        <video
          className="relative h-[112px] w-[84px] object-cover object-center opacity-45 sm:h-[136px] sm:w-[102px] lg:h-[168px] lg:w-[126px]"
          src={cornerVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
}
