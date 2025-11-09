import { Outlet } from "react-router";
import { LayoutProvider } from "./LayoutProvider";
import Header from "./header";

export default function Layout() {

    

    return (
        <LayoutProvider>
            <div className="flex flex-col h-screen">
                <Header />
                <Outlet />
            </div>
        </LayoutProvider>
    );
}
