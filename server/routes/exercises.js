const express = require('express');
const dml = require('../exercises/dataManagementLayer');

const router = express.Router();

// Define route to fetch exercises data
router.get('/exercises', async (req, res) => {
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

module.exports = router;

