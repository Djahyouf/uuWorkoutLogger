const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs/promises");
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const dataPath = path.join(rootPath, "exercises");
const customExercisesFilePath = path.join(dataPath + "/custom_exercises.json");

console.log("rootPath=" + rootPath);
console.log("dataPath=" + dataPath);
console.log("customExercisesPath=" + customExercisesFilePath);

const BACK = "back_exercises.json";
const BICEPS = "biceps_exercises.json";
const CALVES = "calves_exercises.json";
const CHEST = "chest_exercises.json";
const HAMSTRINGS = "hamstrings_exercises.json";
const QUADS = "quads_exercises.json";
const SHOULDERS = "shoulders_exercises.json";
const TRICEPS = "triceps_exercises.json";
const CUSTOM = "custom_exercises.json";

async function readDataRoutines(entityName) {
  const rawFileContent = await fs.readFile(path.join(dataPath, entityName));
  return JSON.parse(rawFileContent);
}

async function getExercises() {
  const back = await readDataRoutines(BACK);
  const biceps = await readDataRoutines(BICEPS);
  const calves = await readDataRoutines(CALVES);
  const chest = await readDataRoutines(CHEST);
  const hamstrings = await readDataRoutines(HAMSTRINGS);
  const quads = await readDataRoutines(QUADS);
  const shoulders = await readDataRoutines(SHOULDERS);
  const triceps = await readDataRoutines(TRICEPS);
  const custom = await readDataRoutines(CUSTOM);

  return {
    back,
    biceps,
    calves,
    chest,
    hamstrings,
    quads,
    shoulders,
    triceps,
    custom,
  };
}

async function getCustomExercises() {
  return await readDataRoutines(CUSTOM);
}

async function createCustomExercise(newExercise) {
  newExercise.id = uuidv4();
  const customExercisesFile = path.join(dataPath, CUSTOM);
  let customExercises = await readDataRoutines(CUSTOM);

  customExercises.push(newExercise);

  await fs.writeFile(
    customExercisesFile,
    JSON.stringify(customExercises, null, 2),
  );
}

async function deleteCustomExercise(id) {
  try {
    let exercises = await getCustomExercises();
    const index = exercises.findIndex((exercise) => exercise.id === id);
    if (index !== -1) {
      exercises.splice(index, 1);
      await fs.writeFile(customExercisesFilePath, JSON.stringify(exercises, null, 2));
      console.log("Custom exercise deleted successfully");
      return true;
    } else {
      console.error("Custom exercise not found for deletion");
      return false;
    }
  } catch (error) {
    console.error("Error deleting custom exercise:", error);
    return false;
  }
}


module.exports.createCustomExercise = createCustomExercise;
module.exports.getExercises = getExercises;
module.exports.getCustomExercises = getCustomExercises;
module.exports.deleteCustomExercise = deleteCustomExercise;
