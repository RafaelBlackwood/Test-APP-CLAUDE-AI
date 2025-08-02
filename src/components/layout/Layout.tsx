import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {showSidebar && (
          <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 lg:bottom-0">
            <Sidebar />
          </aside>
        )}
        
        <main className={`flex-1 ${showSidebar ? 'lg:pl-64' : ''} pt-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}