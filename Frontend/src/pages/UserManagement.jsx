import { useState, useEffect } from "react";
import axios from "axios";
import {
    Users, Users2, GraduationCap, CheckSquare, Clock,
    Search, Edit, Trash2, Shield, Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All Users");
    const [search, setSearch] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", role: "student", status: "Active", password: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status || "Active",
                password: "", // Empty for edit unless changing
            });
        } else {
            setEditingUser(null);
            setFormData({ firstName: "", lastName: "", email: "", role: "student", status: "Active", password: "" });
        }
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Edit User
                const res = await axios.put(`http://localhost:5000/user/${editingUser._id}`, formData);
                setUsers(users.map(u => (u._id === editingUser._id ? res.data : u)));
            } else {
                // Add User (Via Auth Register Endpoint for password hashing)
                await axios.post("http://localhost:5000/api/auth/register", formData);
                fetchUsers(); // Re-fetch to get new user with correct default status/dates
            }
            setIsModalOpen(false);
        } catch (err) {
            alert("Error saving user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/user/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Error deleting user");
        }
    };

    // Derived Stats
    const studentsCount = users.filter(u => u.role === "student").length;
    const lecturersCount = users.filter(u => u.role === "lecturer").length;
    const activeCount = users.filter(u => u.status === "Active").length;
    const pendingCount = users.filter(u => u.status !== "Active").length; // Assuming non-active is pending/inactive

    // Filtering
    const filteredUsers = users.filter(u => {
        const matchesFilter = filter === "All Users" ||
            (filter === "Students" && u.role === "student") ||
            (filter === "Lecturers" && u.role === "lecturer") ||
            (filter === "Admins" && u.role === "admin");
        const matchesSearch = u.firstName.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    User Management
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Users", value: users.length, icon: Users2, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Students", value: studentsCount, icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Lecturers", value: lecturersCount, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Active", value: activeCount, icon: CheckSquare, color: "text-green-400", bg: "bg-green-500/10" },
                    { label: "Pending/Inactive", value: pendingCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1a1d2d] rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between gap-4 py-4">
                <div className="flex bg-[#1a1d2d] p-1 rounded-xl border border-slate-800 self-start">
                    {["All Users", "Students", "Lecturers", "Admins"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-64 bg-[#1a1d2d] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-[#1a1d2d] rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Registered Users</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-[#13151f] text-slate-500 border-b border-slate-800 font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-[#1f2235] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${u.role === "admin" ? "bg-red-500/80" :
                                                        u.role === "lecturer" ? "bg-purple-500/80" :
                                                            "bg-emerald-500/80"
                                                    }`}>
                                                    {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-200">{u.firstName} {u.lastName}</div>
                                                    <div className="text-xs text-slate-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-medium capitalize">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${u.status === "Active"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                                }`}>
                                                {u.status || "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                            {new Date(u.createdAt || Date.now()).toISOString().split('T')[0]}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(u)}
                                                className="p-1.5 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="p-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal matching EduCore UI */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1d2d] rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#13151f]/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                {editingUser ? "Edit User" : "+ Add User"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role *</label>
                                    <select
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="lecturer">Lecturer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status *</label>
                                    <select
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password *</label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-transparent border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    {editingUser ? "Update User" : "Save User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
