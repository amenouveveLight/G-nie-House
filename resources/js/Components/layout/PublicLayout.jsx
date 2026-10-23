import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="public-layout-root">
      <Header />
      <main className="public-main-content" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
