import { useForm } from '@inertiajs/react';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/login');
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
        {(errors.email || errors.password) && (
          <div className="admin-login-alert">
            <AlertCircle size={18} />
            <span>{errors.email || errors.password}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-group">
            <label htmlFor="email">Adresse e-mail</label>
            <div className="admin-login-input-wrap">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="vous@glamor-beauty.com"
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
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn admin-login-submit"
            disabled={processing}
          >
            <span>{processing ? 'Connexion en cours...' : 'Se connecter'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="admin-login-footer">
          <p>© 2026 Glam'Or Beauty Salon & Spa • Abidjan, Côte d'Ivoire</p>
        </div>
      </div>
    </div>
  );
}
