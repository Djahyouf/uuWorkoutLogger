const fs = require('node:fs/promises');
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const dataPath = path.join(rootPath, "exercises");

console.log("rootPath=" + rootPath);
console.log("dataPath=" + dataPath);

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

    return { back, biceps, calves, chest, hamstrings, quads, shoulders, triceps, custom };
}

async function createCustomExercise(newExercise) {
    const customExercisesFile = path.join(dataPath, CUSTOM);
    let customExercises = await readDataRoutines(CUSTOM);

    customExercises.push(newExercise);

    await fs.writeFile(customExercisesFile, JSON.stringify(customExercises, null, 2));
}

module.exports.createCustomExercise = createCustomExercise;
module.exports.getExercises = getExercises;
