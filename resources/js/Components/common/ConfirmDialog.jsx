import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Modal from './Modal';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'warning', // 'danger' | 'warning' | 'info'
  isLoading = false,
}) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="confirm-icon danger" size={26} />;
      case 'warning':
        return <AlertCircle className="confirm-icon warning" size={26} />;
      case 'info':
      default:
        return <Info className="confirm-icon info" size={26} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const footerContent = (
    <div className="confirm-dialog-actions">
      <button
        type="button"
        className="btn-dialog-cancel"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={`btn-dialog-confirm btn-dialog-${variant}`}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footerContent}
      size="sm"
      className="confirm-dialog-modal"
    >
      <div className="confirm-dialog-body">
        <div className={`confirm-icon-wrapper ${variant}`}>
          {getIcon()}
        </div>
        <div className="confirm-message-text">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
      </div>
    </Modal>
  );
}
