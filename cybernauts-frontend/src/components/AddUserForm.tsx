import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const AddUserForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [hobbies, setHobbies] = useState("");
  const { addUser } = useUserContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !age) {
      toast.error("Please fill username and age");
      return;
    }

    const data = {
      username,
      age: Number(age),
      hobbies: hobbies ? hobbies.split(",").map((h) => h.trim()) : [],
    };

    await addUser(data);

    // ✅ Instantly tell Graph.tsx to reload (no refresh needed)
    window.dispatchEvent(new Event("reloadGraph"));

    // Clear form fields
    setUsername("");
    setAge("");
    setHobbies("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-center gap-3 bg-white shadow-sm rounded-xl p-4 w-full"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none w-32"
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none w-24"
      />

      <input
        type="text"
        placeholder="Hobbies (comma-separated)"
        value={hobbies}
        onChange={(e) => setHobbies(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 outline-none w-56"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Add User
      </button>
    </form>
  );
};

export default AddUserForm;
