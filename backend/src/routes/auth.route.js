import express from "express";

import {
  decrementBadHabit,
  decrementGoodHabit,
  getTodayHabits,
  getUserHabits,
  incrementBadHabit,
  incrementGoodHabit,
  loginUser,
  registerUser,
  deleteUser,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.delete("/:userId", protectRoute, deleteUser);

router.put("/:userId/good", incrementGoodHabit);
router.put("/:userId/bad", incrementBadHabit);

router.put("/:userId/good/decrement", decrementGoodHabit);
router.put("/:userId/bad/decrement", decrementBadHabit);

router.get("/:userId/habits", getUserHabits);
router.get("/:userId/today", getTodayHabits);

export default router;
