import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";
import { calculatePopularity } from "../utils/popularity";

// Fetch all users
export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

// Graph data (nodes + edges) for React Flow
// Graph data (nodes + edges) for React Flow
export const getGraph = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    // ✅ Each node must have both `id` and `data.id`
    const nodes = users.map((u) => ({
      id: u._id.toString(),
      data: {
        id: u._id.toString(), // crucial for ReactFlow state stability
        username: u.username,
        age: u.age,
        popularity: u.popularityScore,
        hobbies: u.hobbies,
        label: `${u.username} (${u.age})`,
      },
    }));

    // ✅ edges (undirected, single per pair)
    const seen = new Set<string>();
    const edges: { id: string; source: string; target: string }[] = [];

    users.forEach((u) => {
      u.friends.forEach((f: mongoose.Types.ObjectId) => {
        const a = u._id.toString();
        const b = f.toString();
        const key = a < b ? `${a}_${b}` : `${b}_${a}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ id: key, source: a, target: b });
        }
      });
    });

    // ✅ Send complete data
    res.json({ nodes, edges });
  } catch (err) {
    console.error("❌ Graph generation error:", err);
    res.status(500).json({ message: "Server error generating graph" });
  }
};


// Create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, age, hobbies } = req.body;
    if (!username || !age || !Array.isArray(hobbies)) return res.status(400).json({ message: "Invalid user data" });
    const user = new User({ username, age, hobbies, friends: [] });
    await user.save();
    // compute popularity (initially 0)
    await calculatePopularity(user._id.toString());
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log("🔄 Update called for ID:", req.params.id);
    console.log("📦 Body:", req.body);

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    await calculatePopularity(updated._id.toString());
    await Promise.all(updated.friends.map((f: any) => calculatePopularity(f.toString())));

    console.log("✅ Updated user:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    console.log("🗑️ Delete called for ID:", req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.length > 0) {
      console.log("⚠️ User still linked to friends");
      return res.status(409).json({ message: "Cannot delete user while linked. Unlink first." });
    }

    await User.findByIdAndDelete(req.params.id);
    console.log("✅ User deleted");
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};


// Link users (create friendship) - prevent duplicates/circular
export const linkUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ message: "friendId required" });
    if (userId === friendId) return res.status(400).json({ message: "Cannot link user to themselves" });

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ message: "User or friend not found" });

    // Check if already linked (either direction)
    if (user.friends.map(String).includes(friendId) || friend.friends.map(String).includes(userId)) {
      return res.status(409).json({ message: "Users already linked" });
    }

    user.friends.push(friend._id);
    friend.friends.push(user._id);
    await user.save();
    await friend.save();

    await calculatePopularity(user._id.toString());
    await calculatePopularity(friend._id.toString());

    res.json({ message: "Users linked" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unlink users (remove friendship)
export const unlinkUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ message: "friendId required" });
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ message: "User or friend not found" });

    user.friends = user.friends.filter((f) => f.toString() !== friendId);
    friend.friends = friend.friends.filter((f) => f.toString() !== userId);

    await user.save();
    await friend.save();

    await calculatePopularity(user._id.toString());
    await calculatePopularity(friend._id.toString());

    res.json({ message: "Users unlinked" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
