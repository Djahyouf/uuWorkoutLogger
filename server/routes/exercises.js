const express = require("express");
const dml = require("../exercises/exercisesDataManagementLayer");

const router = express.Router();

router.get("/exercises", async (req, res) => {
  console.log("exercises requested...");

  try {
    const exercises = await dml.getExercises();
    console.log("exercises recieved !");
    res.json(exercises);
    console.log("exercises sent !");
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/custom-exercises", async (req, res) => {
  console.log("Received request body:", req.body);

  try {
    const newExercise = req.body;
    await dml.createCustomExercise(newExercise);
    res.status(201).json({ message: "Custom exercise created successfully!" });
  } catch (error) {
    console.error("Error creating custom exercise:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/custom-exercises", async (req, res) => {
  console.log("custom exercises requested...");

  try {
    const exercises = await dml.getCustomExercises();
    console.log("custom exercises recieved !");
    res.json(exercises);
    console.log("custom exercises sent !");
  } catch (error) {
    console.error("Error fetching custom exercises:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/custom-exercises/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const success = await dml.deleteCustomExercise(id);
    if (success) {
      res.status(200).send("Custom exercise deleted successfully");
    } else {
      res.status(404).send("Custom exercise not found");
    }
  } catch (error) {
    console.error("Error deleting custom exercise:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
