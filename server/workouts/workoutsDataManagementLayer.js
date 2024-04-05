const fs = require("node:fs/promises");
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const workoutsPath = path.join(rootPath, "workouts");
const workoutsFilePath = path.join(workoutsPath, "workouts.json");

async function readWorkouts() {
  try {
    const rawFileContent = await fs.readFile(workoutsFilePath);
    return JSON.parse(rawFileContent);
  } catch (error) {
    console.error("Error reading workouts file:", error);
    return [];
  }
}

async function saveWorkout(workout) {
  try {
    let workouts = await readWorkouts();
    workouts.push(workout);
    await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2));
    console.log("Workout saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving workout:", error);
    return false;
  }
}

module.exports = {
  readWorkouts,
  saveWorkout,
};
