import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("components/layout.tsx", [
        index("routes/home.tsx"),
        route("login", "routes/auth/login.tsx"),
        route("register", "routes/auth/register.tsx"),
        route("discover", "routes/discover.tsx"),
        route("/concert/:concert_id", "routes/concert.tsx")
    ])
] satisfies RouteConfig;
