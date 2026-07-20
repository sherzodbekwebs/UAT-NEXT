'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams } from 'next/navigation';

export const Link = React.forwardRef(({ to, replace, scroll, shallow, passHref, legacyBehavior, prefetch, ...props }, ref) => {
  const href = typeof to === 'string' ? to : to?.pathname || '/';
  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      legacyBehavior={legacyBehavior}
      prefetch={prefetch}
      ref={ref}
      {...props}
    />
  );
});

export const BrowserRouter = ({ children }) => <>{children}</>;
export const HashRouter = ({ children }) => <>{children}</>;
export const MemoryRouter = ({ children }) => <>{children}</>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = ({ element }) => element || null;
export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
};

const parseLocation = (pathname, search = '', hash = '') => ({
  pathname: pathname || '/',
  search,
  hash,
});

export const useLocation = () => {
  const pathname = usePathname();
  const [location, setLocation] = useState(() => {
    if (typeof window === 'undefined') return parseLocation(pathname);
    return parseLocation(window.location.pathname, window.location.search, window.location.hash);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncLocation = () => {
      setLocation(parseLocation(window.location.pathname, window.location.search, window.location.hash));
    };

    syncLocation();
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    return () => {
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('hashchange', syncLocation);
    };
  }, [pathname]);

  return location;
};

export const useNavigate = () => {
  const router = useRouter();
  return useCallback((to) => {
    if (to === -1) router.back();
    else if (typeof to === 'string') router.push(to);
    else if (to && typeof to === 'object') {
      const path = to.pathname || '/';
      const search = to.search || '';
      router.push(`${path}${search}`);
    }
  }, [router]);
};

export const useParams = () => {
  return useNextParams() || {};
};

export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [params, setParams] = useState(() => {
    if (typeof window === 'undefined') return new URLSearchParams('');
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncParams = () => setParams(new URLSearchParams(window.location.search));
    syncParams();
    window.addEventListener('popstate', syncParams);
    return () => window.removeEventListener('popstate', syncParams);
  }, []);

  const setSearchParams = useCallback((next) => {
    const currentParams = new URLSearchParams(params.toString());
    let targetParams = currentParams;

    if (typeof next === 'function') {
      targetParams = next(currentParams);
    } else if (next instanceof URLSearchParams) {
      targetParams = next;
    } else if (typeof next === 'string') {
      targetParams = new URLSearchParams(next.replace(/^[?#]/, ''));
    }

    const searchString = targetParams.toString();
    const newPath = `${pathname}${searchString ? `?${searchString}` : ''}`;
    router.push(newPath);
  }, [router, pathname, params]);

  return [params, setSearchParams];
};

export const createBrowserRouter = () => null;
export const createMemoryRouter = () => null;
export const createRoutesFromChildren = () => null;
export const unstable_HistoryRouter = BrowserRouter;
