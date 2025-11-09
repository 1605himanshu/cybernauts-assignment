import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const hobbyList = [
  "Coding", "Gaming", "Music", "Sports", "Design", "Travel",
  "Movies", "Photography", "Cooking", "Dancing", "Reading",
];

const HobbySidebar: React.FC = () => {
  const [search, setSearch] = useState("");
  const filtered = hobbyList.filter(h => h.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="mb-3">
        <label className="text-sm font-medium block mb-1">Hobbies</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hobbies..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Hobby List */}
      <div className="flex-1 overflow-auto mt-2 space-y-2">
        {filtered.length > 0 ? (
          filtered.map((hobby) => (
            <div
              key={hobby}
              draggable
              onDragStart={(e) => e.dataTransfer?.setData("text/plain", hobby)}
              className="cursor-grab px-3 py-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            >
              {hobby}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No hobbies found</p>
        )}
      </div>

      {/* Footer Tip */}
      <p className="mt-3 text-xs text-gray-500">
        💡 Tip: Drag a hobby onto a user node to add it.
      </p>
    </div>
  );
};

export default HobbySidebar;
