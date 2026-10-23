import React from 'react';
import { Sparkles } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'Aucun élément trouvé',
  message = 'Il n’y a aucun résultat ou élément à afficher pour le moment.',
  action,
  onAction,
  className = '',
}) {
  return (
    <div className={`empty-state-card ${className}`}>
      <div className="empty-state-icon-wrapper">
        {Icon && <Icon className="empty-state-icon" size={38} strokeWidth={1.5} />}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      {message && <p className="empty-state-message">{message}</p>}
      {(action || onAction) && (
        <div className="empty-state-action-wrap">
          {typeof action === 'string' ? (
            <button
              type="button"
              className="btn-empty-state"
              onClick={onAction}
            >
              {action}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}
