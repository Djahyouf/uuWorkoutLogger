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

router.post('/custom-exercises', async (req, res) => {

    console.log('Received request body:', req.body);

    try {
        const newExercise = req.body;
        await dml.createCustomExercise(newExercise);
        res.status(201).json({ message: 'Custom exercise created successfully!' });
    } catch (error) {
        console.error("Error creating custom exercise:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

