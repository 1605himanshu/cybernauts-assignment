import React from "react";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import { updateUserApi } from "../../api/userApi";
import { toast } from "react-toastify";

const LowScoreNode = ({ data }: any) => {
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData("text/plain");
    if (!hobby) return;

    try {
      const updatedHobbies = data.hobbies?.includes(hobby)
        ? data.hobbies
        : [...(data.hobbies || []), hobby];

      await updateUserApi(data.id, { hobbies: updatedHobbies });
      if (data.refreshGraph) await data.refreshGraph();

      toast.success(`Hobby '${hobby}' added to ${data.username}`);
    } catch (err) {
      toast.error("Failed to add hobby");
    }
  };

  const size = 70 + data.popularity * 4; // dynamic size but within limit
  const bgColor =
    data.popularity > 3
      ? "bg-green-100 border-green-400 text-green-800"
      : "bg-gray-100 border-gray-400 text-gray-700";

  return (
    <motion.div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg shadow-md text-center px-3 py-2 font-medium ${bgColor} overflow-hidden break-words truncate`}
      style={{
        width: `${size}px`,
        minWidth: "120px",
        maxWidth: "150px",
        height: "auto",
      }}
    >
      <div className="truncate">{data.username}</div>
      <div className="text-xs mt-1 opacity-80">
        Score: {data.popularity.toFixed(1)}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default LowScoreNode;
