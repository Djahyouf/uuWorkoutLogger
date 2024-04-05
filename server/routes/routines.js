const express = require("express");
const router = express.Router();
const routinesDML = require("../routines/routinesDataManagementLayer");

router.get("/routines", async (req, res) => {
  try {
    const routines = await routinesDML.readRoutines();
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/routines", async (req, res) => {
  try {
    const { name, exercises } = req.body;
    const routine = { name, exercises };
    const success = await routinesDML.saveRoutine(routine);
    if (success) {
      res.status(201).json({ message: "Routine saved successfully" });
    } else {
      res.status(500).json({ message: "Failed to save routine" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
