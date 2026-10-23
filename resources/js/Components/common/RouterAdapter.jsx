import React from 'react';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';

// Compatible Link component
export function Link({ to, href, children, ...props }) {
  return (
    <InertiaLink href={to || href || '#'} {...props}>
      {children}
    </InertiaLink>
  );
}

// Compatible NavLink component
export function NavLink({ to, href, className, children, end, ...props }) {
  const { url } = usePage();
  const target = to || href || '';
  const isActive = end ? url === target : url.startsWith(target);
  const resolvedClass = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <InertiaLink href={target} className={resolvedClass} {...props}>
      {children}
    </InertiaLink>
  );
}

// Compatible useNavigate hook
export function useNavigate() {
  return (to, options) => {
    if (typeof to === 'number') {
      window.history.go(to);
    } else {
      router.visit(to, options);
    }
  };
}

// Compatible useLocation hook
export function useLocation() {
  const { url } = usePage();
  const [pathname, search] = (url || '/').split('?');
  return {
    pathname: pathname || '/',
    search: search ? `?${search}` : '',
    hash: window.location.hash || '',
  };
}

// Compatible useSearchParams hook
export function useSearchParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const setSearchParams = (newParams) => {
    const searchString = typeof newParams === 'string' ? newParams : new URLSearchParams(newParams).toString();
    router.visit(`${location.pathname}?${searchString}`, { preserveState: true });
  };
  return [searchParams, setSearchParams];
}

// Compatible Navigate component
export function Navigate({ to, replace }) {
  React.useEffect(() => {
    router.visit(to, { replace: !!replace });
  }, [to, replace]);
  return null;
}

// Compatible Outlet component
export function Outlet({ children }) {
  return children || null;
}
