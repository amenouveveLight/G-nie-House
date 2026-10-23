import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Sparkles, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Veuillez renseigner votre nom d’utilisateur et mot de passe.');
      return;
    }

    setLoading(true);
    const result = login(username.trim(), password);

    if (result.success) {
      success(`Bienvenue, ${result.user.name} !`);
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Identifiants incorrects. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-backdrop-glow"></div>

      <div className="admin-login-card">
        {/* Salon Branding Header */}
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <Sparkles size={16} />
            <span>Espace Professionnel</span>
          </div>
          <h1 className="admin-login-title">Glam'Or Beauty</h1>
          <p className="admin-login-subtitle">Portail d'Administration du Salon</p>
          <div className="admin-login-divider"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-login-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-group">
            <label htmlFor="username">Identifiant / Nom d'utilisateur</label>
            <div className="admin-login-input-wrap">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin, manager, employee"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-login-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="admin-login-input-wrap">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn admin-login-submit"
            disabled={loading}
          >
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div className="admin-login-demo-section">
          <div className="demo-header">
            <ShieldCheck size={16} />
            <span>Comptes de test disponibles</span>
          </div>
          <p className="demo-hint">Cliquez sur un compte pour remplir instantanément les identifiants :</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-pill admin"
              onClick={() => fillCredentials('admin', 'admin123')}
            >
              <span className="demo-role">Directrice</span>
              <code>admin</code>
            </button>
            <button
              type="button"
              className="demo-pill manager"
              onClick={() => fillCredentials('manager', 'manager123')}
            >
              <span className="demo-role">Responsable</span>
              <code>manager</code>
            </button>
            <button
              type="button"
              className="demo-pill employee"
              onClick={() => fillCredentials('employee', 'employee123')}
            >
              <span className="demo-role">Employée</span>
              <code>employee</code>
            </button>
          </div>
        </div>

        <div className="admin-login-footer">
          <p>© 2026 Glam'Or Beauty Salon & Spa • Abidjan, Côte d'Ivoire</p>
        </div>
      </div>
    </div>
  );
}
