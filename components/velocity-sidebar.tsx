'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Target,
  Zap,
  Brain,
  Shield,
  FileText,
  Gamepad2,
  Settings,
  ChevronDown,
  X,
  Menu,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  submenu?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Home & Overview',
  },
  {
    label: 'My Profile',
    href: '/profile',
    icon: <Users className="w-5 h-5" />,
    description: 'Your AURA Stats',
  },
  {
    label: 'Study Planner',
    href: '/study-planner',
    icon: <Target className="w-5 h-5" />,
    description: 'Task Management & Scheduling',
    submenu: [
      { label: 'Tasks', href: '/study-planner/tasks' },
      { label: 'Calendar', href: '/study-planner/calendar' },
      { label: 'Spaced Repetition', href: '/study-planner/spaced-rep' },
    ],
  },
  {
    label: 'Focus Tools',
    href: '/focus-tools',
    icon: <Zap className="w-5 h-5" />,
    description: 'Panic Mode, Ghost Mode, Focus-Fuel',
    submenu: [
      { label: 'Panic Mode', href: '/focus-tools/panic-mode' },
      { label: 'Ghost Mode Sprints', href: '/focus-tools/ghost-mode' },
      { label: 'Focus-Fuel Tracking', href: '/focus-tools/focus-fuel' },
    ],
  },
  {
    label: 'Intelligence Hub',
    href: '/intelligence-hub',
    icon: <Brain className="w-5 h-5" />,
    description: 'AI Assistance & Syllabus Intake',
    submenu: [
      { label: 'Nova Assistant', href: '/intelligence-hub/nova' },
      { label: 'Syllabus Upload', href: '/intelligence-hub/syllabus' },
      { label: 'Resource Aggregator', href: '/intelligence-hub/resources' },
    ],
  },
  {
    label: 'Deep Work Shield',
    href: '/deep-work-shield',
    icon: <Shield className="w-5 h-5" />,
    description: 'Distraction Blocking & Sync',
  },
  {
    label: 'Study Rooms',
    href: '/study-rooms',
    icon: <Users className="w-5 h-5" />,
    description: 'Ghost Study Rooms & Body Doubling',
  },
  {
    label: 'Achievements',
    href: '/achievements',
    icon: <FileText className="w-5 h-5" />,
    description: 'Consistency Score & Heatmaps',
  },
  {
    label: 'Game VEDA',
    href: '/game-veda',
    icon: <Gamepad2 className="w-5 h-5" />,
    description: 'Earn Credits - Micro Games',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Preferences & Configuration',
  },
];

export default function VelocitySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 z-40 md:hidden p-3 rounded-full bg-primary text-primary-foreground glow-primary hover:shadow-lg transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border overflow-y-auto transition-all duration-300 z-30 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-2">
          <h2 className="text-sm font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-6">
            Navigation
          </h2>

          {menuItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                // Expandable Menu
                <button
                  onClick={() =>
                    setExpandedMenu(
                      expandedMenu === item.href ? null : item.href
                    )
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-accent/30'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sidebar-accent">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-sidebar-foreground/50 truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                      expandedMenu === item.href ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                // Simple Link
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-accent/30'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                  }`}
                >
                  <span className="text-sidebar-accent">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-sidebar-foreground/50 truncate">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.href && (
                <div className="mt-2 ml-4 space-y-1 border-l border-sidebar-border pl-3">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded text-sm transition-colors ${
                        isActive(subitem.href)
                          ? 'text-sidebar-primary bg-sidebar-primary/10'
                          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-primary/5'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Nova Icon */}
        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold glow-accent animate-pulse-glow">
          N
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
