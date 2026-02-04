'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  isSignUp: boolean
  onAuthSuccess: (name: string) => void
}

export default function AuthModal({ isOpen, onClose, isSignUp: initialIsSignUp, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({ eightChars: false, uppercase: false, number: false })

  const updatePasswordStrength = (pwd: string) => {
    setPasswordStrength({
      eightChars: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value
    setPassword(pwd)
    updatePasswordStrength(pwd)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields')
        return
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match')
        return
      }
      if (!passwordStrength.eightChars || !passwordStrength.uppercase || !passwordStrength.number) {
        alert('Password must meet all requirements')
        return
      }
      onAuthSuccess(fullName)
    } else {
      if (!email || !password) {
        alert('Please fill in all fields')
        return
      }
      onAuthSuccess('User')
    }
  }

  const handleGoogleClick = () => {
    onAuthSuccess(isSignUp ? fullName || 'User' : 'User')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <span className="text-xl text-white font-bold">⚖️</span>
              </div>
              <div>
                <div className="font-bold text-lg text-primary">Lexi<span className="text-accent">Tax</span></div>
                <div className="text-xs text-gray-500">AI ASSISTANT</div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-2">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <p className="text-gray-600 mb-6">{isSignUp ? 'Get full access to tax law research' : 'Sign in to your account'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Button onClick={handleGoogleClick} type="button" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 font-medium">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <text x="5" y="18" fontSize="14" fill="currentColor">
                  G
                </text>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="button" className="absolute right-3 top-2.5 text-gray-400">
                  👁️
                </button>
              </div>

              {isSignUp && password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordStrength.eightChars ? '✓ text-green-600' : '✗ text-gray-400'}>
                      {passwordStrength.eightChars ? '✓' : '✗'}
                    </span>
                    <span className={passwordStrength.eightChars ? 'text-green-600' : 'text-gray-600'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordStrength.uppercase ? '✓ text-green-600' : '✗ text-gray-400'}>
                      {passwordStrength.uppercase ? '✓' : '✗'}
                    </span>
                    <span className={passwordStrength.uppercase ? 'text-green-600' : 'text-gray-600'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={passwordStrength.number ? '✓ text-green-600' : '✗ text-gray-400'}>
                      {passwordStrength.number ? '✓' : '✗'}
                    </span>
                    <span className={passwordStrength.number ? 'text-green-600' : 'text-gray-600'}>One number</span>
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
