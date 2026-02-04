'use client';

import { Button } from '@/components/ui/button'

interface HeaderProps {
  onLogoClick: () => void
  isLoggedIn: boolean
  onLoginClick: () => void
}

export default function Header({ onLogoClick, isLoggedIn, onLoginClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <span className="text-xl text-white font-bold">⚖️</span>
          </div>
          <div>
            <div className="font-bold text-lg text-primary">Lexi<span className="text-accent">Tax</span></div>
            <div className="text-xs text-gray-500">AI ASSISTANT</div>
          </div>
        </button>

        {!isLoggedIn && (
          <Button onClick={onLoginClick} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
