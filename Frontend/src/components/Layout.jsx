import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <div className="min-h-screen bg-[#0b0e14] text-slate-300">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[#0b0e14] text-slate-300 flex">
            <Sidebar />
            <div className="flex-1 md:ml-64 min-w-0">
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
