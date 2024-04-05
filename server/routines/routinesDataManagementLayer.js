const fs = require("node:fs/promises");
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);
const routinesPath = path.join(rootPath, "routines");
const routinesFilePath = path.join(routinesPath, "routines.json");

async function readRoutines() {
  try {
    const rawFileContent = await fs.readFile(routinesFilePath);
    return JSON.parse(rawFileContent);
  } catch (error) {
    console.error("Error reading routines file:", error);
    return [];
  }
}

async function saveRoutine(routine) {
  try {
    let routines = await readRoutines();
    routines.push(routine);
    await fs.writeFile(routinesFilePath, JSON.stringify(routines, null, 2));
    console.log("Routine saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving routine:", error);
    return false;
  }
}

module.exports = {
  readRoutines,
  saveRoutine,
};
