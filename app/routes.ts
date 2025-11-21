import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from "@react-router/dev/routes";

export default [
    layout("components/layout.tsx", [
        index("routes/home.tsx"),
        route("login", "routes/auth/login.tsx"),
        route("register", "routes/auth/register.tsx"),
        route("discover", "routes/discover.tsx"),
        route("concert/:concert_id", "routes/concert.tsx"),
        ...prefix("artist", [
            route("concerts", "routes/artist/concerts.tsx"),
            route("media", "routes/artist/media.tsx")
        ])
    ]),
    route("concert/:concert_id/live", "routes/live.tsx"),
] satisfies RouteConfig;
