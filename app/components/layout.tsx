import { Outlet } from "react-router";
import Header from "./header";

export default function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Outlet />
        </div>
    );
}
