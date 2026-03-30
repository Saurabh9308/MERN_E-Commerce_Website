import React from "react";
import UserTable from "../../components/admin/UserTable";

const AdminUsers = () => {
  return (
    <div>
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-[10px] font-black tracking-[0.3em] text-[#E0655F] uppercase bg-white rounded-full shadow-sm mb-4">
          Management Portal
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
          Community
        </h1>
      </div>
      <UserTable />
    </div>
  );
};

export default AdminUsers;
