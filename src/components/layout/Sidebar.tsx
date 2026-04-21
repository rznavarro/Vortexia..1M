import React from 'react';
import { 
  Terminal, 
  Users, 
  Triangle, 
  CircleDot, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export type TabId = 'comando' | 'leads' | 'pipeline' | 'miami' | 'config';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  urgentCount?: number;
  attentionNeeded?: boolean;
}

const navItems = [
  { id: 'comando', icon: Terminal, label: 'COMANDO' },
  { id: 'leads', icon: Users, label: 'LEADS' },
  { id: 'pipeline', icon: Triangle, label: 'PIPELINE' },
  { id: 'miami', icon: CircleDot, label: 'MIAMI' },
  { id: 'config', icon: Settings, label: 'CONFIG' },
] as const;

export function Sidebar({ activeTab, onTabChange, urgentCount, attentionNeeded }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-vx-surface border-right border-vx-border flex flex-col items-center py-8 z-50">
      <div className="flex flex-col gap-6 w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative group flex items-center justify-center w-full py-4 transition-all duration-300",
                isActive ? "text-vx-gold" : "text-vx-tobacco hover:text-vx-cream"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-3 bg-vx-gold"
                  style={{ borderRadius: '0 2px 2px 0' }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
              
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Semantic Alerts */}
                {item.id === 'leads' && urgentCount && urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-vx-burgundy rounded-full animate-pulse" />
                )}
                {item.id === 'pipeline' && attentionNeeded && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-vx-amber rounded-full" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute left-16 px-2 py-1 bg-vx-raised text-vx-cream text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-vx-border">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto">
        {/* Logo or footer icon */}
        <div className="w-8 h-8 rounded-sm overflow-hidden border border-vx-border flex items-center justify-center">
          <span className="text-vx-gold font-serif text-lg tracking-tighter">VX</span>
        </div>
      </div>
    </aside>
  );
}
