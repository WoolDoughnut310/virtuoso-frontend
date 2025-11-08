import { Outlet } from "react-router";

export default function AuthLayout() {
    return <div className="flex flex-col h-screen">
        <div className="flex flex-row px-16 py-14 border-b-4 border-b-[#ccac54]">
            <h1 className="font-bodoni-moda font-semibold text-8xl">Virtuoso</h1>
        </div>
        <div className="flex flex-col justify-center grow">
            <Outlet />
        </div>
    </div>
}