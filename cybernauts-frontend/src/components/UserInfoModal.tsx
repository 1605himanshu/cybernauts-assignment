import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";

interface UserInfoModalProps {
  user: any;
  onClose: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ user, onClose }) => {
  const { updateUser, deleteUser, refreshUsers } = useUserContext();

  const [username, setUsername] = useState(user?.username || "");
  const [age, setAge] = useState(user?.age ?? "");
  const [hobbies, setHobbies] = useState((user?.hobbies || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Safely get user ID
  const getUserId = () => user?._id || user?.id;

  // ✅ Update user details
  const handleSave = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      setSaving(true);
      await updateUser(userId, {
        username,
        age: Number(age),
        hobbies: hobbies ? hobbies.split(",").map((h) => h.trim()) : [],
      });

      // 🔁 Refresh graph + analytics instantly
      window.dispatchEvent(new Event("reloadGraph"));
      await refreshUsers();

      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete user
  const handleDelete = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.username || "this user"}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteUser(userId); // toast already handled in UserContext

      // 🔁 Refresh instantly
      window.dispatchEvent(new Event("reloadGraph"));
      await refreshUsers();

      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user (unlink first if linked).");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
          Edit User Info
        </h3>

        {/* User Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Hobbies</label>
            <input
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="Hobbies (comma-separated)"
              className="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none"
            />
          </div>
        </div>

        {/* Popularity Info */}
        <p className="text-gray-600 mt-3 text-center text-sm">
          Popularity Score:{" "}
          <span className="font-medium text-gray-800">
            {user?.popularityScore ?? "N/A"}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
