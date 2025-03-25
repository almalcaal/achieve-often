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
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/:userId/good", incrementGoodHabit);
router.put("/:userId/bad", incrementBadHabit);

router.put("/:userId/good/decrement", decrementGoodHabit);
router.put("/:userId/bad/decrement", decrementBadHabit);

router.get("/:userId/habits", getUserHabits);
router.get("/:userId/today", getTodayHabits);

export default router;
