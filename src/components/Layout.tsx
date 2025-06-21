import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MainNavigation from './MainNavigation'; // Import the new navigation component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      <Header />
      <MainNavigation /> {/* Add the main navigation bar here */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;