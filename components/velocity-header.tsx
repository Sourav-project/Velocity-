'use client';

import { useState } from 'react';
import { Bell, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function VelocityHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 glow-primary">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-lg blur-lg glow-primary group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">V</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text animate-glow">Velocity</h1>
              <p className="text-xs text-foreground/50">Adaptive Study Planner</p>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/schedule" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">Schedule</Link>
            <Link href="/profile" className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">Profile</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-card/50 transition-colors">
              <Bell className="w-5 h-5 text-foreground/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full glow-accent"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 glow-primary flex items-center justify-center text-foreground font-bold hover:from-primary/70 hover:to-secondary/70 transition-all duration-300"
              >
                U
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-2xl py-2 z-50 glow-primary">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors text-sm"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors text-sm"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-destructive/10 transition-colors text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-foreground/70" />
              ) : (
                <Menu className="w-5 h-5 text-foreground/70" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-card/50 border-t border-border/50 py-4 px-4 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground/70 hover:text-foreground py-2 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/schedule"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground/70 hover:text-foreground py-2 text-sm"
            >
              Schedule
            </Link>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block text-foreground/70 hover:text-foreground py-2 text-sm"
            >
              Profile
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
