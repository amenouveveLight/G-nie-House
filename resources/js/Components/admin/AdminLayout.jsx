import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  ShoppingBag,
  Package,
  CreditCard,
  Users,
  UserCog,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, module: 'dashboard', end: true },
  { path: '/admin/rendez-vous', label: 'Rendez-vous', icon: Calendar, module: 'appointments' },
  { path: '/admin/services', label: 'Services', icon: Scissors, module: 'services' },
  { path: '/admin/produits', label: 'Boutique & Stocks', icon: ShoppingBag, module: 'products' },
  { path: '/admin/commandes', label: 'Commandes', icon: Package, module: 'orders' },
  { path: '/admin/paiements', label: 'Paiements', icon: CreditCard, module: 'payments' },
  { path: '/admin/clientes', label: 'Clientes', icon: Users, module: 'clients' },
  { path: '/admin/personnel', label: 'Personnel', icon: UserCog, module: 'staff' },
  { path: '/admin/parametres', label: 'Paramètres', icon: Settings, module: 'settings' },
];

const ROLE_LABELS = {
  admin: 'Directrice',
  manager: 'Responsable',
  employee: 'Collaboratrice',
};

export default function AdminLayout() {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const { notifications, dispatch } = useData();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Filter nav items by permissions
  const allowedNavItems = NAV_ITEMS.filter((item) => hasPermission(item.module));

  // Determine dynamic page title
  const currentNavItem = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNavItem ? currentNavItem.label : "Administration";

  // Notifications calculation
  const unreadNotifications = (notifications || []).filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  const handleLogout = () => {
    logout();
    info('Vous êtes déconnecté.');
    navigate('/admin/login', { replace: true });
  };

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const handleNotificationClick = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  return (
    <div className="admin-root">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Sparkles size={20} />
          </div>
          <div className="admin-brand-text">
            <h2>Glam'Or Beauty</h2>
            <span>Maison de Beauté</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="admin-user-badge">
          <div className="user-avatar-placeholder">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Administrateur'}</span>
            <span className={`user-role-badge role-${user?.role || 'admin'}`}>
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="admin-nav">
          <p className="admin-nav-category">MENU PRINCIPAL</p>
          <ul className="admin-nav-list">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    <ChevronRight size={14} className="nav-arrow" />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <div className="admin-breadcrumbs">
              <span className="breadcrumb-root">Portail</span>
              <span className="breadcrumb-separator">/</span>
              <h1 className="breadcrumb-current">{pageTitle}</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Notification Bell with Popup */}
            <div className="admin-notif-container">
              <button
                type="button"
                className="admin-icon-btn notif-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>

              {notificationsOpen && (
                <div className="admin-notif-dropdown">
                  <div className="notif-dropdown-header">
                    <div className="notif-header-title">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="badge badge-rose">{unreadCount} neuves</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="mark-all-read-btn"
                        onClick={handleMarkAllRead}
                      >
                        <CheckCheck size={14} />
                        <span>Tout marquer lu</span>
                      </button>
                    )}
                  </div>

                  <div className="notif-dropdown-list">
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`notif-item ${!notif.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notif.id)}
                        >
                          <div className="notif-dot"></div>
                          <div className="notif-content">
                            <p className="notif-msg">{notif.message}</p>
                            <span className="notif-time">
                              {new Date(notif.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="notif-empty">Aucune notification</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Summary */}
            <div className="admin-profile-pill">
              <div className="profile-pill-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-pill-details">
                <span className="profile-pill-name">{user?.name}</span>
                <span className="profile-pill-role">{ROLE_LABELS[user?.role] || user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="admin-page-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
