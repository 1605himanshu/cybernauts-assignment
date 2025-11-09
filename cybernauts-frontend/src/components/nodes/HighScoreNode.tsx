import React from "react";
import { Handle, Position } from "reactflow";
import { updateUserApi } from "../../api/userApi";

const HighScoreNode = ({ data }: any) => {
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData("text/plain");
    if (!hobby) return;

    try {
      const updatedHobbies = data.hobbies?.includes(hobby)
        ? data.hobbies
        : [...(data.hobbies || []), hobby];

      await updateUserApi(data.id, { hobbies: updatedHobbies });

      // Force refresh from parent
      if (data.refreshGraph) {
        await data.refreshGraph(); // reload data
      }

    } catch (err) {
      console.error("Failed to add hobby:", err);
      alert("❌ Failed to add hobby");
    }
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="bg-yellow-100 border-2 border-yellow-400 rounded-md px-3 py-2 shadow text-sm text-center transition-transform hover:scale-105"
    >
      <div className="font-semibold text-yellow-800">{data.username}</div>
      <div className="text-xs text-gray-600">Score: {data.popularity.toFixed(1)}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default HighScoreNode;
