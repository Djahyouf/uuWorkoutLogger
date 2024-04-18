import axios from "axios";

const caller = (url = "http://localhost:3001/api") => {
  return axios.create({
    baseURL: url,
  });
};

const API = {
  getExercises() {
    return caller()
      .get("/exercises")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  },
  createCustomExercise(data) {
    return caller().post("/custom-exercises", data);
  },
  getRoutines() {
    return caller()
      .get("/routines")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  },
  createRoutine(data) {
    return caller().post("/routines", data);
  },
  getWorkouts() {
    return caller()
      .get("/workouts")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  },
  createWorkout(data) {
    return caller().post("/workouts", data);
  },
  deleteWorkoutByDate(date) {
    return caller().delete("/workouts/" + date.toString());
  },
};

export default API;
