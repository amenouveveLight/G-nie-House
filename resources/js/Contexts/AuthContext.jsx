import { router, usePage } from '@inertiajs/react';

// Modules accessibles par rôle. Ceci ne sert qu'à adapter l'interface :
// l'autorisation réelle est appliquée côté serveur (middleware `module`).
const ROLE_MODULES = {
  admin: ['*'],
  manager: ['dashboard', 'appointments', 'services', 'products', 'orders', 'payments', 'clients', 'staff'],
  employee: ['dashboard', 'appointments'],
};

/**
 * Utilisateur authentifié, fourni par Laravel via les props partagées Inertia.
 * À utiliser dans les pages et layouts (à l'intérieur de <App />).
 */
export function useAuth() {
  const user = usePage().props.auth?.user ?? null;

  const hasPermission = (module) => {
    if (!user) return false;
    const modules = ROLE_MODULES[user.role] ?? [];
    return modules.includes('*') || modules.includes(module);
  };

  // Rechargement complet après déconnexion : vide les données chargées en mémoire.
  const logout = () => router.post('/admin/logout', {}, {
    onFinish: () => window.location.assign('/admin/login'),
  });

  return {
    user: user && { ...user, professionalId: user.professional_id },
    isAuthenticated: !!user,
    logout,
    hasPermission,
  };
}
