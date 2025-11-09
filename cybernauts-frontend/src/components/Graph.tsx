import React, { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { getGraphApi, linkUsersApi, unlinkUsersApi } from "../api/userApi";
import { toast } from "react-toastify";
import HighScoreNode from "./nodes/HighScoreNode";
import LowScoreNode from "./nodes/LowScoreNode";
import UserInfoModal from "./UserInfoModal";
import { FiRotateCcw, FiRotateCw, FiMaximize2 } from "react-icons/fi";
import { useUserContext } from "../context/UserContext";

const nodeTypes = {
  highScore: HighScoreNode,
  lowScore: LowScoreNode,
};

const GraphContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const undoStack = useRef<any[]>([]);
  const redoStack = useRef<any[]>([]);

  const reactFlowInstance = useReactFlow();
  const { refreshUsers } = useUserContext();

  // ✅ Load Graph
  const loadGraph = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGraphApi();
      const { nodes: backendNodes, edges: backendEdges } = res.data;

      setNodes((prevNodes) => {
        const existingPositions = Object.fromEntries(
          prevNodes.map((n) => [n.id, n.position])
        );

        const basePosition =
          prevNodes.length > 0
            ? prevNodes[Math.floor(Math.random() * prevNodes.length)].position
            : { x: 200, y: 200 };

        const newNodes = backendNodes.map((n: any, idx: number) => {
          const existing = existingPositions[n.id];
          const offset = (Math.random() - 0.5) * 150;

          return {
            id: n.id,
            data: {
              ...n.data,
              id: n.id,
              refreshGraph: loadGraph,
            },
            position:
              existing || {
                x: basePosition.x + (idx % 3) * 120 + offset,
                y: basePosition.y + Math.floor(idx / 3) * 120 + offset,
              },
            type: n.data.popularity > 5 ? "highScore" : "lowScore",
          };
        });

        localStorage.setItem(
          "nodePositions",
          JSON.stringify(Object.fromEntries(newNodes.map((n) => [n.id, n.position])))
        );

        return newNodes;
      });

      setEdges(
        backendEdges.map((ed: any) => ({
          id: ed.id,
          source: ed.source,
          target: ed.target,
          animated: true,
          type: "smoothstep",
        }))
      );

      setTimeout(() => reactFlowInstance.fitView({ duration: 700, padding: 0.3 }), 200);
      await refreshUsers();
    } catch (err) {
      console.error("Failed to load graph:", err);
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges, reactFlowInstance, refreshUsers]);

  useEffect(() => {
    loadGraph();
    const listener = () => loadGraph();
    window.addEventListener("reloadGraph", listener);
    return () => window.removeEventListener("reloadGraph", listener);
  }, [loadGraph]);

  // ✅ Save positions
  const savePositions = useCallback((updatedNodes) => {
    const positions = Object.fromEntries(updatedNodes.map((n: any) => [n.id, n.position]));
    localStorage.setItem("nodePositions", JSON.stringify(positions));
  }, []);

  const handleNodesChange = useCallback(
    (changes: any) => {
      undoStack.current.push({ nodes, edges });
      redoStack.current = [];
      onNodesChange(changes);
      setTimeout(() => savePositions(nodes), 300);
    },
    [nodes, edges, onNodesChange, savePositions]
  );

  // ✅ Connect users
  const onConnect = useCallback(
    async (connection: any) => {
      const src = connection.source;
      const tgt = connection.target;
      if (!src || !tgt || src === tgt) return;

      const alreadyLinked = edges.some(
        (ed) =>
          (ed.source === src && ed.target === tgt) ||
          (ed.source === tgt && ed.target === src)
      );
      if (alreadyLinked) return;

      undoStack.current.push({ nodes, edges });
      redoStack.current = [];

      const newEdge = {
        id: `${src}_${tgt}`,
        source: src,
        target: tgt,
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));

      try {
        await linkUsersApi(src, tgt);
        toast.success("Users linked");
        await loadGraph();
      } catch (err) {
        console.error("Link failed:", err);
        setEdges((eds) => eds.filter((ed) => ed.id !== newEdge.id));
      }
    },
    [edges, setEdges, loadGraph, nodes]
  );

  // ✅ Unlink users (on edge click)
  const handleUnlink = useCallback(
    async (edge: any) => {
      const confirmed = window.confirm("Do you want to unlink these users?");
      if (!confirmed) return;

      try {
        await unlinkUsersApi(edge.source, edge.target);
        toast.success("Users unlinked");

        await loadGraph();
        await refreshUsers();
      } catch (err) {
        console.error("Unlink failed:", err);
        toast.error("Failed to unlink users");
      }
    },
    [loadGraph, refreshUsers]
  );

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const previous = undoStack.current.pop();
      redoStack.current.push({ nodes, edges });
      setNodes(previous.nodes);
      setEdges(previous.edges);
    }
  }, [nodes, edges]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop();
      undoStack.current.push({ nodes, edges });
      setNodes(next.nodes);
      setEdges(next.edges);
    }
  }, [nodes, edges]);

  const handleCenterView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.25, duration: 700 });
  }, [reactFlowInstance]);

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedUser(node.data);
  }, []);

  // ✅ Empty state
  if (!loading && nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg font-medium">
        🚀 No users yet — Add some to see the network!
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Loader */}
      {loading && (
        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded shadow text-sm text-gray-700 z-50">
          Loading graph...
        </div>
      )}

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-6 top-4 z-20 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-lg shadow-md flex space-x-2 px-3 py-2"
      >
        <button
          onClick={handleUndo}
          className="p-2 rounded hover:bg-blue-100 transition"
          title="Undo"
        >
          <FiRotateCcw size={16} />
        </button>
        <button
          onClick={handleRedo}
          className="p-2 rounded hover:bg-blue-100 transition"
          title="Redo"
        >
          <FiRotateCw size={16} />
        </button>
        <button
          onClick={handleCenterView}
          className="p-2 rounded hover:bg-blue-100 transition"
          title="Center View"
        >
          <FiMaximize2 size={16} />
        </button>
      </motion.div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={(_, edge) => handleUnlink(edge)} // 👈 right here
        fitView
        fitViewOptions={{ padding: 0.25 }}
      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>

      {/* User Modal */}
      {selectedUser && (
        <UserInfoModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

const Graph = () => (
  <ReactFlowProvider>
    <GraphContent />
  </ReactFlowProvider>
);

export default Graph;
