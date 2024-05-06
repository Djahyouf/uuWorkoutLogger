const fs = require("node:fs/promises");
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const workoutsPath = path.join(rootPath, "workouts");
const workoutsFilePath = path.join(workoutsPath, "workouts.json");

function calculateVolume(workout) {
  let totalVolume = 0;

  workout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      const reps = parseInt(set.reps);
      const weight = parseInt(set.weight);
      totalVolume += reps * weight;
    });
  });

  workout.volume = totalVolume;
}

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
    calculateVolume(workout);
    await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2));
    console.log("Workout saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving workout:", error);
    return false;
  }
}

async function deleteWorkout(date) {
  try {
    let workouts = await readWorkouts();
    const updatedWorkouts = workouts.filter((workout) => workout.date !== date);
    await fs.writeFile(
      workoutsFilePath,
      JSON.stringify(updatedWorkouts, null, 2),
    );
    console.log("Workout deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    return false;
  }
}

async function updateWorkout(updatedWorkout) {
  try {
    let workouts = await readWorkouts();
    calculateVolume(updatedWorkout);
    const index = workouts.findIndex(
      (workout) => workout.date === updatedWorkout.date,
    );
    console.log("Updated Workout:", updatedWorkout);
    console.log("Existing Workouts:", workouts);
    if (index !== -1) {
      workouts[index] = updatedWorkout;
      await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2));
      console.log("Workout updated successfully");
      return true;
    } else {
      console.error("Workout not found for updating");
      return false;
    }
  } catch (error) {
    console.error("Error updating workout:", error);
    return false;
  }
}

module.exports = {
  readWorkouts,
  saveWorkout,
  deleteWorkout,
  updateWorkout,
};
