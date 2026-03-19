import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, Target, BarChart2, Settings, GraduationCap, LogOut } from "lucide-react";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const mainLinks = [
        { name: "User Management", path: "/users", icon: Users },
        { name: "Study Goals", path: "/dashboard", icon: Target, badge: 4 },
    ];

    const systemLinks = [
        { name: "Analytics", path: "/analytics", icon: BarChart2 },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 h-screen bg-[#13151f] border-r border-slate-800 flex flex-col justify-between hidden md:flex fixed top-0 left-0">

            {/* Top Section */}
            <div>
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600/20 p-2 rounded-xl text-blue-500">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">EduCore</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase text-[10px]">Academic System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="py-6 px-4 space-y-8">

                    {/* Main Links */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">Main</p>
                        <div className="space-y-1">
                            {mainLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${active
                                                ? "bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${active ? "text-blue-500" : "text-opacity-70"}`} />
                                            <span>{link.name}</span>
                                        </div>
                                        {link.badge && (
                                            <span className="bg-blue-600/20 text-blue-400 py-0.5 px-2 rounded-full text-xs font-bold">
                                                {link.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* System Links */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">System</p>
                        <div className="space-y-1">
                            {systemLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active
                                                ? "bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${active ? "text-blue-500" : "text-opacity-70"}`} />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Profile Section */}
            {user && (
                <div className="p-4 border-t border-slate-800">
                    <div className="bg-[#1a1d2d] rounded-2xl p-3 flex items-center justify-between border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold flex-shrink-0">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold text-slate-200 truncate">{user.firstName} {user.lastName}</p>
                                <p className="text-[10px] text-teal-400 font-medium uppercase tracking-wider">{user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Sidebar;
