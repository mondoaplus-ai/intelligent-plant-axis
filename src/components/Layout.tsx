import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div 
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header />
        
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-6 overflow-y-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <footer className="border-t border-border py-4 px-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>SmartERP AI v1.0.0 BETA</p>
            <p className="flex items-center gap-2">
              Powered by <span className="text-accent font-semibold">AI</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
