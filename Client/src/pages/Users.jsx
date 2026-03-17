import { useState } from "react";
import Table from "../components/UI/Table";

const Users = () => {
  const [users] = useState([
    {
      _id: "1",
      name: "Admin User",
      email: "admin@example.com",
      mobile: "+1234567890",
      role: "admin",
      isActive: true,
      createdAt: "2024-01-01",
    },
    {
      _id: "2",
      name: "John Smith",
      email: "john@example.com",
      mobile: "+1234567891",
      role: "mentor",
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      _id: "3",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      mobile: "+1234567892",
      role: "mentor",
      isActive: true,
      createdAt: "2024-02-10",
    },
    {
      _id: "4",
      name: "Michael Brown",
      email: "michael@example.com",
      mobile: "+1234567893",
      role: "mentee",
      isActive: true,
      createdAt: "2024-03-05",
    },
    {
      _id: "5",
      name: "Emily Davis",
      email: "emily@example.com",
      mobile: "+1234567894",
      role: "mentee",
      isActive: false,
      createdAt: "2024-03-20",
    },
    {
      _id: "6",
      name: "David Wilson",
      email: "david@example.com",
      mobile: "+1234567895",
      role: "user",
      isActive: true,
      createdAt: "2024-04-01",
    },
    {
      _id: "7",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      mobile: "+1234567896",
      role: "mentee",
      isActive: true,
      createdAt: "2024-04-15",
    },
    {
      _id: "8",
      name: "Robert Taylor",
      email: "robert@example.com",
      mobile: "+1234567897",
      role: "mentor",
      isActive: true,
      createdAt: "2024-05-01",
    },
  ]);

  const columns = [
    {
      key: "image",
      title: "Profile",
      render: (user) => (
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
      ),
    },
    {
      key: "name",
      title: "Name",
      render: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      key: "email",
      title: "Email",
      render: (user) => <span>{user.email}</span>,
    },
    {
      key: "mobile",
      title: "Mobile",
      render: (user) => <span>{user.mobile}</span>,
    },
    {
      key: "role",
      title: "Role",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : user.role === "mentor"
              ? "bg-blue-100 text-blue-700"
              : user.role === "mentee"
              ? "bg-pink-100 text-pink-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      key: "isActive",
      title: "Status",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (user) => user.createdAt,
    },
  ];

  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log("Delete user:", user);
    }
  };

  const handleAddNew = () => {
    console.log("Add new user");
  };

  return (
    <div className="p-4">
      <Table
        title="User Management"
        addButtonText="Add New User"
        columns={columns}
        data={users}
        onAddNew={handleAddNew}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={false}
      />
      <div className="mt-4 text-sm text-gray-600">
        Showing {users.length} users
      </div>
    </div>
  );
};

export default Users;
