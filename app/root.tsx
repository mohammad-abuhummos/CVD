import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AuthProvider, RequireAuth } from "./auth";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Auth components now provided by app/auth.tsx

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
            {message}
          </h1>
          <p className="text-xl text-gray-700">{details}</p>
        </div>
        {stack && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Stack Trace:</h2>
            <pre className="w-full p-4 overflow-x-auto bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
              <code>{stack}</code>
            </pre>
          </div>
        )}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go Home
          </a>
        </div>
      </div>
    </main>
  );
}
