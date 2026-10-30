import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

import { CartProvider } from './Contexts/CartContext';
import { DataProvider } from './Contexts/DataContext';
import { ToastProvider } from './Contexts/ToastContext';
import PublicLayout from './Components/layout/PublicLayout';
import AdminLayout from './Components/admin/AdminLayout';

createInertiaApp({
  title: (title) => title ? `${title} - Glam'Or Beauty` : "Glam'Or Beauty - Maison de Beauté",
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    let page = pages[`./Pages/${name}.jsx`];
    
    if (!page) {
      throw new Error(`Inertia page not found: ${name}`);
    }

    const component = page.default || page;

    // Apply default layout if not explicitly set on page
    if (component.layout === undefined) {
      if (name.startsWith('admin/')) {
        if (name !== 'admin/AdminLogin') {
          component.layout = (pageElement) => <AdminLayout>{pageElement}</AdminLayout>;
        }
      } else {
        component.layout = (pageElement) => <PublicLayout>{pageElement}</PublicLayout>;
      }
    }

    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <DataProvider initialPage={props.initialPage}>
        <CartProvider>
          <ToastProvider>
            <App {...props} />
          </ToastProvider>
        </CartProvider>
      </DataProvider>
    );
  },
});
