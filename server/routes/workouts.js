const express = require("express");
const workoutsDML = require("../workouts/workoutsDataManagementLayer");

const router = express.Router();

router.get("/workouts", async (req, res) => {
  try {
    const workouts = await workoutsDML.readWorkouts();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/workouts", async (req, res) => {
  try {
    const { date, volume, exercises } = req.body;
    const workout = { date, volume, exercises };
    const success = await workoutsDML.saveWorkout(workout);
    if (success) {
      res.status(201).json({ message: "Workout saved successfully" });
    } else {
      res.status(500).json({ message: "Failed to save workout" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
