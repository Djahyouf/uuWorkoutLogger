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
  getCustomExercises() {
    return caller()
      .get("/custom-exercises")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteCustomExercise(id) {
    return caller().put("/custom-exercises/" + id.toString());
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
    return caller().delete("/workouts/delete/" + date.toString());
  },
  updateWorkoutByDate(date, data) {
    return caller().put("/workouts/update/" + date.toString(), data);
  },
};

export default API;
