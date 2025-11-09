import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  linkUsersApi,
} from "../api/userApi";
import { toast } from "react-toastify";

export interface IUser {
  _id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  popularityScore: number;
  createdAt?: string;
}

interface IUserContext {
  users: IUser[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  addUser: (user: { username: string; age: number; hobbies: string[] }) => Promise<void>;
  updateUser: (id: string, data: Partial<IUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  linkUsers: (source: string, target: string) => Promise<void>;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsersApi();
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Fetch users error:", err);
      toast.error("Failed to fetch users");
      setError("Fetch error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const addUser = async (user: { username: string; age: number; hobbies: string[] }) => {
    try {
      await createUserApi(user);
      toast.success("✅ User created");
      await refreshUsers();
    } catch (err) {
      console.error("Add user failed:", err);
      toast.error("Failed to create user");
    }
  };

  const updateUser = async (id: string, data: Partial<IUser>) => {
    try {
      const res = await updateUserApi(id, data);
      const updatedUser = res.data;

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...updatedUser } : u))
      );

      toast.success("✅ User updated");
      refreshUsers(); // optional soft refresh
    } catch (err) {
      console.error("❌ Update user failed:", err);
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("🗑️ User deleted");
    } catch (err: any) {
      console.error("❌ Delete user failed:", err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const linkUsers = async (source: string, target: string) => {
    try {
      await linkUsersApi(source, target);
      toast.success("🔗 Users linked");
      await refreshUsers();
    } catch (err) {
      console.error("Link failed:", err);
      toast.error("Linking failed");
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        refreshUsers,
        addUser,
        updateUser,
        deleteUser,
        linkUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
