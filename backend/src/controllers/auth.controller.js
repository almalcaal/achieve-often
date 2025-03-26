import {
  generateToken,
  getStartOfDayInUserTimezone,
  validateEmail,
} from "../lib/utils.js";
import User from "../models/user.model.js";

// @desc            Register a new user
// @route           POST /api/auth/register
// @access          Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required inputs" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

    const lowerCaseUsername = username.toLowerCase();

    const existingUsername = await User.findOne({
      username: lowerCaseUsername,
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const randomImage = `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}`;

    const user = await User.create({
      username,
      email,
      password,
      profileImage: randomImage,
    });

    if (user) {
      await user.save();

      //   token will be used to authenticate user giving them permission to CRUD book posts. so client will be using the token and the server will check who owns the token
      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.log(`ERROR in registerUser controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Authenticate user / get token
// @route           POST /api/auth/login
// @access          Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const correctPassword = await user.comparePassword(password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.log("Error in loginUser controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Delete user account
// @route           DELETE /api/auth/:userId
// @access          Private
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.log(`ERROR in deleteUser controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Increment user good habit
// @route           PUT /api/auth/:userId/good
// @access          Private
export const incrementGoodHabit = async (req, res) => {
  try {
    const { timezone } = req.body;
    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfUserDayUTC = getStartOfDayInUserTimezone(new Date(), timezone);
    const dateString = startOfUserDayUTC.toISOString().split("T")[0];

    if (!user.dailyHabits.has(dateString)) {
      user.dailyHabits.set(dateString, { goodCount: 0, badCount: 0 });
    }

    const dailyCounts = user.dailyHabits.get(dateString);
    dailyCounts.goodCount += 1;
    user.dailyHabits.set(dateString, dailyCounts);

    await user.save();
    res.json(user);
  } catch (err) {
    console.log(`ERROR in incrementGoodHabit controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Increment user bad habit
// @route           PUT /api/auth/:userId/bad
// @access          Private
export const incrementBadHabit = async (req, res) => {
  try {
    const { timezone } = req.body;
    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfUserDayUTC = getStartOfDayInUserTimezone(new Date(), timezone);
    const dateString = startOfUserDayUTC.toISOString().split("T")[0];

    if (!user.dailyHabits.has(dateString)) {
      user.dailyHabits.set(dateString, { goodCount: 0, badCount: 0 });
    }

    const dailyCounts = user.dailyHabits.get(dateString);
    dailyCounts.badCount += 1;
    user.dailyHabits.set(dateString, dailyCounts);

    await user.save();
    res.json(user);
  } catch (err) {
    console.log(`ERROR in incrementBadHabit controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Decrement user good habit
// @route           PUT /api/auth/:userId/good/decrement
// @access          Private
export const decrementGoodHabit = async (req, res) => {
  try {
    const { timezone } = req.body;
    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfUserDayUTC = getStartOfDayInUserTimezone(new Date(), timezone);
    const dateString = startOfUserDayUTC.toISOString().split("T")[0];

    if (user.dailyHabits.has(dateString)) {
      const dailyCounts = user.dailyHabits.get(dateString);
      if (dailyCounts.goodCount > 0) {
        dailyCounts.goodCount -= 1;
        user.dailyHabits.set(dateString, dailyCounts);
        await user.save();
        res.status(200).json(user);
      } else {
        return res
          .status(400)
          .json({ message: "Good habit count cannot be negative" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Daily habit not found for this day" });
    }
  } catch (err) {
    console.log(`ERROR in decrementGoodHabit controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Decrement user bad habit
// @route           PUT /api/auth/:userId/bad/decrement
// @access          Private
export const decrementBadHabit = async (req, res) => {
  try {
    const { timezone } = req.body;
    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const startOfUserDayUTC = getStartOfDayInUserTimezone(new Date(), timezone);
    const dateString = startOfUserDayUTC.toISOString().split("T")[0];

    if (user.dailyHabits.has(dateString)) {
      const dailyCounts = user.dailyHabits.get(dateString);
      if (dailyCounts.badCount > 0) {
        dailyCounts.badCount -= 1;
        user.dailyHabits.set(dateString, dailyCounts);
        await user.save();
        res.status(200).json(user);
      } else {
        return res
          .status(400)
          .json({ message: "Bad habit count cannot be negative" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Daily habit not found for this day" });
    }
  } catch (err) {
    console.log(`ERROR in decrementBadHabit controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Get user habits
// @route           GET /api/auth/:userId/habits
// @access          Private
export const getUserHabits = async (req, res) => {
  try {
    const userId = req.params.userId;
    const timezone = req.query.timezone;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    console.log(
      `Fetching habits for userId: ${userId}, page: ${page}, limit: ${limit}, timezone: ${timezone}`
    );

    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user); // Log the user object

    const dailyHabitsArray = Array.from(user.dailyHabits.entries());

    console.log("Daily habits array:", dailyHabitsArray); // Log the habits array

    // Sort by date (newest to oldest)
    dailyHabitsArray.sort((a, b) => new Date(b[0]) - new Date(a[0]));

    // Apply pagination
    const paginatedHabits = dailyHabitsArray.slice(skip, skip + limit);

    console.log("Paginated habits:", paginatedHabits); // Log paginated habits

    const localizedDailyHabits = paginatedHabits.map(([dateString, counts]) => {
      const localizedDate = new Date(dateString);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const formattedDate = formatter.format(localizedDate);

      return {
        date: dateString,
        localizedDate: formattedDate,
        goodCount: counts.goodCount,
        badCount: counts.badCount,
      };
    });

    console.log("Localized habits:", localizedDailyHabits); // Log localized habits

    const totalHabits = dailyHabitsArray.length;

    console.log("Response:", {
      habits: localizedDailyHabits,
      currentPage: page,
      totalHabits,
      totalPages: Math.ceil(totalHabits / limit),
    });

    res.status(200).json({
      habits: localizedDailyHabits,
      currentPage: page,
      totalHabits,
      totalPages: Math.ceil(totalHabits / limit),
    });
  } catch (err) {
    console.log(`ERROR in getUserHabits controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Get today's habits
// @route           GET /api/auth/:userId/today
// @access          Private
export const getTodayHabits = async (req, res) => {
  try {
    const userId = req.params.userId;
    const timezone = req.query.timezone;

    if (!timezone) {
      return res.status(400).json({ message: "Timezone is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfUserDayUTC = getStartOfDayInUserTimezone(new Date(), timezone);
    const dateString = startOfUserDayUTC.toISOString().split("T")[0];

    const dailyCounts = user.dailyHabits.get(dateString) || {
      goodCount: 0,
      badCount: 0,
    };

    res.status(200).json({
      date: dateString,
      goodCount: dailyCounts.goodCount,
      badCount: dailyCounts.badCount,
    });
  } catch (err) {
    console.log(`ERROR in getTodayHabits controller`, err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
