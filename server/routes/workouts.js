const express = require("express");
const bodyParser = require("body-parser");
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

router.delete("/workouts/delete/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const deleted = await workoutsDML.deleteWorkout(date);
    if (deleted) {
      res.status(200).send("Workout deleted successfully");
    } else {
      res.status(404).send("Workout not found");
    }
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/workouts/update/:date", async (req, res) => {

    console.log("Request Body:");
    console.log(req.body);

  const { date, volume, exercises } = req.body;
  const updatedWorkout = { date, volume, exercises };
  updatedWorkout.date = req.params.date;
  try {
    const success = await workoutsDML.updateWorkout(updatedWorkout);
    if (success) {
      res.status(200).send("Workout updated successfully");
    } else {
      res.status(404).send("Workout not found");
    }
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
