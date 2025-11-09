import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  linkUser,
  unlinkUser,
  getUserById,
  getGraph,
} from "../controllers/userController";

const router = express.Router();

// ✅ graph endpoint must come before "/:id"
router.get("/graph/all", getGraph);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/link", linkUser);
router.delete("/:id/unlink", unlinkUser);
router.get("/:id", getUserById);

export default router;
