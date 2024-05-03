import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import API from "./../services/api";
import ReturnButton from "./fixed/returnButton";
import "./../css/header.css";
import "./../css/progress.css";
import "./../css/graph.css";

const ProgressTracker = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [progressData, setProgressData] = useState({});

  const graphWidth = 500;
  const graphHeight = 400;

  const fetchExercises = async () => {
    try {
      const exercisesData = await API.getExercises();
      setExercises(exercisesData);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const workoutsData = await API.getWorkouts();
      setWorkouts(workoutsData);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
  };

  useEffect(() => {
    fetchExercises();
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      const exerciseData = workouts.flatMap((workout) => {
        const exercise = workout.exercises.find(
          (ex) => ex.name === selectedExercise,
        );
        if (exercise) {
          return exercise.sets.map((set) => ({
            date: workout.date,
            weight: parseInt(set.weight, 10) || -1,
            reps: parseInt(set.reps, 10) || -1,
            sets: exercise.sets.length,
          }));
        }
        return [];
      });
      setProgressData(exerciseData);
    }
  }, [selectedExercise, workouts]);

  return (
    <div>
      <div className="Header">
        <h1>Progress Tracker</h1>
      </div>

      <ReturnButton />
      <div className="exercise-select">
        <label>Select Exercise:</label>
        <select value={selectedExercise} onChange={handleExerciseChange}>
          <option value="">Choose an exercise</option>
          {Object.keys(exercises).map((muscleGroup) => (
            <optgroup label={muscleGroup} key={muscleGroup}>
              {exercises[muscleGroup].map((optionExercise) => (
                <option key={optionExercise.id} value={optionExercise.name}>
                  {optionExercise.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {selectedExercise && (
        <div>
          <h3>Progress Graphs</h3>
          <div className="progress-graphs">
            <div className="progress-graph">
              <h4>Weight</h4>
              <BarChart width={graphWidth} height={graphHeight} data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="weight" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="progress-graph">
              <h4>Reps</h4>
              <BarChart width={graphWidth} height={graphHeight} data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reps" fill="#82ca9d" />
              </BarChart>
            </div>
            <div className="progress-graph">
              <h4>Sets</h4>
              <BarChart width={graphWidth} height={graphHeight} data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sets" fill="#ffcccc" />
              </BarChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
