import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to, options = {}) => {
    const target = to || "/";
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method]({}, "", target);
    setPath(target);
  };

  const value = useMemo(() => ({ path, navigate }), [path]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const ctx = useContext(RouterContext);
  if (!ctx) return null;

  const routeList = Array.isArray(children) ? children : [children];
  let fallback = null;

  for (const child of routeList) {
    if (!child) continue;
    if (child.props?.path === "*") {
      fallback = child;
      continue;
    }
    if (child.props?.path === ctx.path) return child.props.element ?? null;
  }

  return fallback ? fallback.props.element ?? null : null;
}

export function Route() {
  return null;
}

export function Navigate({ to, replace = false }) {
  const ctx = useContext(RouterContext);

  useEffect(() => {
    if (ctx) ctx.navigate(to, { replace });
  }, [ctx, to, replace]);

  return null;
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  return (to, options) => {
    if (ctx) ctx.navigate(to, options);
  };
}
