import { type RouteConfig } from "@react-router/dev/routes";

export default [
    {
        path: "/login",
        file: "routes/login.tsx",
    },
    {
        path: "/",
        file: "routes/app.tsx",
        children: [
            { index: true, file: "routes/dashboard.tsx" },
            { path: "support", file: "routes/support.tsx" },
            { path: "status", file: "routes/status.tsx" },
            { path: "logs", file: "routes/logs.tsx" },
        ],
    },
] satisfies RouteConfig;
