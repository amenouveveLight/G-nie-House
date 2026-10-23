import { useLocation, Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export default function AdminPlaceholder({ title = 'Module' }) {
  const location = useLocation();

  return (
    <div className="card empty-state" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <Construction size={48} color="var(--color-gold)" />
      <h3>{title}</h3>
      <p>
        Ce module administratif ({location.pathname}) est en cours de configuration et sera disponible très prochainement.
      </p>
      <Link to="/admin" className="btn btn-primary btn-sm">
        <ArrowLeft size={16} />
        <span>Retour au tableau de bord</span>
      </Link>
    </div>
  );
}
