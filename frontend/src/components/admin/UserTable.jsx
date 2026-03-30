import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Users, Search, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"?`)) return;

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#E0655F]" size={32} />
      </div>
    );
  }

  const MobileUserCard = ({ user }) => (
    <div className="bg-white rounded-2xl p-4 border border-[#D4CDCA] mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-base">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h4 className="font-serif font-bold text-[#1A1A1A]">{user.name}</h4>
            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
              <Mail size={10} className="text-[#E0655F]" /> {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronDown size={18} className={`transform transition-transform ${selectedUser === user._id ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {selectedUser === user._id && (
        <div className="mt-3 pt-3 border-t border-[#D4CDCA]/30">
          <div className="flex items-center justify-between">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                user.role === 'admin'
                  ? 'bg-[#E0655F]/10 text-[#E0655F]'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {user.role === 'admin' && <ShieldCheck size={10} />}
                {user.role}
              </span>
              <p className="text-slate-500 text-xs mt-2">Joined: {formatDate(user.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              {user.role !== 'admin' && (
                <button
                  onClick={() => handleDeleteUser(user._id, user.name)}
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-[#D4CDCA] rounded-xl sm:rounded-full focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none transition-all"
          />
        </div>
        <div className="flex justify-between sm:justify-end items-center gap-3">
          <span className="bg-white border border-[#D4CDCA] px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Total: <span className="text-[#1A1A1A] ml-1">{filteredUsers.length}</span>
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-[#D4CDCA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left">
            <thead className="bg-[#FFF7F3] border-b border-[#D4CDCA]">
              <tr>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">User Details</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">Joined</th>
                <th className="px-4 md:px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4CDCA]/30 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#FFF7F3]/30 transition-colors">
                  <td className="px-4 md:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[#1A1A1A] text-sm md:text-base">{user.name}</h4>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Mail size={10} className="text-[#E0655F]" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'admin'
                        ? 'bg-[#E0655F]/10 text-[#E0655F]'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role === 'admin' && <ShieldCheck size={8} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-4 text-slate-500 text-xs md:text-sm italic">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 md:px-8 py-4">
                    <div className="flex justify-center gap-2">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {filteredUsers.map((user) => (
          <MobileUserCard key={user._id} user={user} />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#D4CDCA]">
          <Users size={40} className="text-[#D4CDCA] mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">No users found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider py-4">
        AuraMart Community Management — {users.length} registered users
      </p>
    </div>
  );
};

export default UserTable;