import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({
  size = 'md',
  message,
  fullPage = false,
  className = ''
}) {
  const content = (
    <div className={`spinner-container spinner-${size} ${className}`} role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true">
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );

  if (fullPage) {
    return <div className="spinner-fullpage-overlay">{content}</div>;
  }

  return content;
}
