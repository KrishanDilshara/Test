import { useState, useEffect } from "react";
import axios from "axios";
import {
    Target, CheckSquare, BarChart2, AlertTriangle, PauseCircle,
    Plus, Calendar, Trash2, Edit
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user: currentUser } = useAuth();
    const [goals, setGoals] = useState([]);
    const [students, setStudents] = useState([]); // for assigning
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All Goals");

    // form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "", description: "", deadline: "", priority: "Medium", status: "Not Started", progress: 0, assignedTo: ""
    });

    // Fetch Goals & Students
    useEffect(() => {
        fetchGoals();
        if (currentUser?.role !== "student") {
            fetchStudents();
        }
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/goals");
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user");
            setStudents(res.data.filter(u => u.role === "student" && u.status === "Active"));
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (goal = null) => {
        if (goal) {
            setEditingId(goal._id);
            setFormData({
                title: goal.title,
                description: goal.description || "",
                deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : "",
                priority: goal.priority || "Medium",
                status: goal.status || "Not Started",
                progress: goal.progress || 0,
                assignedTo: goal.user?._id || currentUser._id
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "", description: "", deadline: "", priority: "Medium", status: "Not Started", progress: 0, assignedTo: currentUser._id
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await axios.put(`http://localhost:5000/api/goals/${editingId}`, formData);
                setGoals(goals.map(g => g._id === editingId ? res.data : g));
            } else {
                const res = await axios.post("http://localhost:5000/api/goals", formData);
                setGoals([res.data, ...goals]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to save goal.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (err) {
            alert("Failed to delete goal.");
        }
    };

    const updateProgress = async (goal) => {
        let newProgress = prompt(`Update progress for "${goal.title}" (0-100):`, goal.progress);
        if (newProgress === null) return;

        newProgress = parseInt(newProgress);
        if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
            alert("Please enter a valid number between 0 and 100.");
            return;
        }

        let newStatus = goal.status;
        if (newProgress === 100) newStatus = "Completed";
        else if (newProgress > 0 && newProgress < 100) newStatus = "In Progress";
        else if (newProgress === 0 && goal.status === "Completed") newStatus = "Not Started";

        try {
            const res = await axios.put(`http://localhost:5000/api/goals/${goal._id}`, {
                progress: newProgress, status: newStatus
            });
            setGoals(goals.map(g => g._id === goal._id ? res.data : g));
        } catch (err) {
            alert("Failed to update progress.");
        }
    };

    // Analytics
    const completedCount = goals.filter(g => g.status === "Completed").length;
    const inProgressCount = goals.filter(g => g.status === "In Progress").length;
    const overdueCount = goals.filter(g => g.status === "Overdue" || (g.deadline && new Date(g.deadline) < new Date() && g.status !== "Completed")).length;
    const notStartedCount = goals.filter(g => g.status === "Not Started").length;

    // Filtered Goals
    const filteredGoals = goals.filter(g => {
        if (filter === "All Goals") return true;
        if (filter === "Overdue") {
            return g.status === "Overdue" || (g.deadline && new Date(g.deadline) < new Date() && g.status !== "Completed");
        }
        return g.status === filter;
    });

    return (
        <div className="space-y-6 pb-20">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    Study Goals
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Goal
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Goals", value: goals.length, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Completed", value: completedCount, icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "In Progress", value: inProgressCount, icon: BarChart2, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Overdue", value: overdueCount, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Not Started", value: notStartedCount, icon: PauseCircle, color: "text-slate-400", bg: "bg-slate-500/10" },
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

            {/* Tabs */}
            <div className="flex bg-[#1a1d2d] p-1 rounded-xl border border-slate-800 self-start w-fit">
                {["All Goals", "In Progress", "Completed", "Overdue"].map(tab => (
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

            {/* Goals Grid */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading goals...</div>
            ) : filteredGoals.length === 0 ? (
                <div className="bg-[#1a1d2d] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    <Target className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-lg font-medium text-white mb-1">No goals found</p>
                    <p>Create a study goal to track your academic progress.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGoals.map(goal => {

                        // Determine status styling
                        let statusColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
                        if (goal.status === "Completed") statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                        if (goal.status === "In Progress") statusColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                        if (goal.status === "Overdue" || (goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== "Completed")) statusColor = "text-red-400 bg-red-500/10 border-red-500/20";

                        // Priority dot
                        let priorityDot = "bg-slate-400";
                        if (goal.priority === "High") priorityDot = "bg-red-500";
                        if (goal.priority === "Medium") priorityDot = "bg-amber-500";
                        if (goal.priority === "Low") priorityDot = "bg-emerald-500";

                        return (
                            <div key={goal._id} className="bg-[#1a1d2d] rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col h-full">

                                {/* Header: Title & Status */}
                                <div className="flex justify-between items-start mb-3 gap-4">
                                    <h3 className={`font-bold text-lg leading-tight ${goal.status === "Completed" ? "text-slate-400" : "text-white"}`}>
                                        {goal.title}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${statusColor}`}>
                                        {(goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== "Completed") ? "Overdue" : goal.status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3">
                                    {goal.description || "No description provided."}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="text-white">{goal.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-1.5 rounded-full ${goal.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                                            style={{ width: `${goal.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Footer Details */}
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mb-6">
                                    {goal.deadline && (
                                        <div className="flex items-center gap-1.5 bg-[#13151f] px-2.5 py-1.5 rounded-lg border border-slate-800">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{new Date(goal.deadline).toISOString().split('T')[0]}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 bg-[#13151f] px-2.5 py-1.5 rounded-lg border border-slate-800">
                                        <span className={`w-2 h-2 rounded-full ${priorityDot}`}></span>
                                        <span>{goal.priority}</span>
                                    </div>
                                    {goal.user && (
                                        <div className="flex items-center gap-1.5 bg-[#13151f] px-2.5 py-1.5 rounded-lg border border-slate-800">
                                            <span>{goal.user.firstName} {goal.user.lastName}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                                    <button
                                        onClick={() => updateProgress(goal)}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                                    >
                                        Update %
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(goal)}
                                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goal._id)}
                                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1d2d] rounded-3xl shadow-2xl w-full max-w-lg border border-slate-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-[#13151f]/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-500" />
                                {editingId ? "Edit Study Goal" : "Add New Goal"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Goal Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Complete Data Structures revision"
                                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    placeholder="What do you want to achieve?"
                                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm min-h-[100px] resize-y"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deadline *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm [color-scheme:dark]"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                                    <select
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="High"> High</option>
                                        <option value="Medium"> Medium</option>
                                        <option value="Low"> Low</option>
                                    </select>
                                </div>
                            </div>

                            {currentUser?.role !== "student" && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assigned To (Student)</label>
                                    <select
                                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                    >
                                        <option value={currentUser._id}>Myself</option>
                                        {students.map(s => (
                                            <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Progress (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    value={formData.progress}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value) || 0;
                                        if (val > 100) val = 100;
                                        if (val < 0) val = 0;
                                        let stat = formData.status;
                                        if (val === 100) stat = "Completed";
                                        else if (val > 0) stat = "In Progress";
                                        else if (val === 0 && stat === "Completed") stat = "Not Started";
                                        setFormData({ ...formData, progress: val, status: stat });
                                    }}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-sm font-medium text-slate-300 hover:text-white bg-transparent border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
