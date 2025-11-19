import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate,
    useRouteError,
} from "react-router";
import { Toaster } from "~/components/ui/sonner";

import "./app.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./client/client.gen";
import queryClient from "./lib/queryClient";

import { Home, ZapOff, RefreshCw } from "lucide-react";
import Header from "./components/header";

client.setConfig({
    baseUrl: "http://localhost:8000",
    credentials: "include",
});

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Virtuoso</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
                <ScrollRestoration />
                <Scripts />
                <Toaster />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const navigate = useNavigate();
    const error = useRouteError();

    let message = "Oops! Something went wrong.";
    let details =
        "We hit an unexpected snag while loading this page. Please try navigating home or refreshing the browser.";
    let recoveryAction: "home" | "refresh" | "manage" = "home";
    let stack: string | undefined;

    // --- 1. Handle HTTP/Route Errors (404, 500s from loaders) ---
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            message = "404: Concert Not Found 🎻";
            details =
                "It looks like the concert or page you're looking for doesn't exist, has been deleted, or the URL is incorrect.";
            recoveryAction = "home";
        } else if (error.status === 403) {
            message = "Access Denied 🔒";
            details =
                "You don't have permission to view this content. If this is a concert page, you may need to log in or purchase a ticket.";
            recoveryAction = "home";
        } else {
            message = `Server Error (${error.status})`;
            details =
                (error.data as string) ||
                "The server failed to process the request. The service may be temporarily unavailable.";
            recoveryAction = "refresh";
        }

        // --- 2. Handle Runtime Errors (Development Only) ---
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        message = "Runtime Error (Dev Mode) 🐞";
        details = error.message;
        stack = error.stack;
        recoveryAction = "refresh";

        // --- 3. Handle Generic Errors ---
    } else if (error && error instanceof Error) {
        // Fallback for production if it's a known Error instance (but hide stack)
        details =
            "An application error occurred. We recommend going home and trying again.";
    }

    // --- Contextual Button Rendering ---
    const renderRecoveryButton = () => {
        if (recoveryAction === "home") {
            return (
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="bg-[#C39F45] hover:bg-[#A88C3E] hover:cursor-pointer text-gray-900 font-bold text-lg py-3 px-8 rounded-lg shadow-lg flex flex-row items-center"
                >
                    <Home className="mr-2 h-5 w-5" /> Back to Home
                </button>
            );
        }
        if (recoveryAction === "refresh") {
            return (
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-[#282828] hover:bg-[#4a4a4a] hover:cursor-pointer text-[#C39F45] font-bold border border-[#C39F45] text-lg py-3 px-8 rounded-lg shadow-lg flex flex-row items-center"
                >
                    <RefreshCw className="mr-2 h-5 w-5" /> Try Refreshing
                </button>
            );
        }
        // Potential future action for artists:
        // if (recoveryAction === 'manage') {
        //     return <button type="button" onClick={() => navigate('/artist/dashboard')}>Go to Dashboard</button>
        // }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header title="Error" />
            <main className="pt-16 p-8 container mx-auto flex flex-col items-center text-center">
                <ZapOff className="w-16 h-16 text-red-500 mb-6" />

                <h1 className="text-5xl font-bold font-playfair-display text-[#C39F45] mb-4">
                    {message}
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-10">
                    {details}
                </p>

                <div className="flex space-x-4">{renderRecoveryButton()}</div>

                {/* --- Stack Trace (Dev Only) --- */}
                {stack && (
                    <div className="mt-12 w-full max-w-4xl text-left bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">
                            Technical Details:
                        </h3>
                        <pre className="w-full overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap wrap-break-word">
                            <code>{stack}</code>
                        </pre>
                    </div>
                )}
            </main>
        </div>
    );
}
