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

const ProgressTracker = () => {
  const metrics = ["weight", "reps", "sets"];

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [progressData, setProgressData] = useState({});

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

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  useEffect(() => {
    fetchExercises();
    fetchWorkouts();
    if (selectedExercise && selectedMetric) {
      if (selectedMetric === "sets") {
        const exerciseData = workouts.flatMap((workout) => {
          const exercise = workout.exercises.find(
            (ex) => ex.name === selectedExercise,
          );
          if (exercise) {
            return [{ date: workout.date, value: exercise.sets.length }];
          }
          return [];
        });
        setProgressData({
          [selectedExercise]: { [selectedMetric]: exerciseData },
        });
      } else {
        const exerciseData = workouts.flatMap((workout) => {
          const exercise = workout.exercises.find(
            (ex) => ex.name === selectedExercise,
          );
          if (exercise) {
            return exercise.sets.map((set) => ({
              date: workout.date,
              value: parseInt(set[selectedMetric], 10) || -1,
            }));
          }
          return [];
        });
        setProgressData({
          [selectedExercise]: { [selectedMetric]: exerciseData },
        });
      }
    }
  }, [selectedExercise, selectedMetric, workouts]);

  return (
    <div>
      <h2>Progress Tracker</h2>
      <div>
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
          <label>Select Metric:</label>
          <select value={selectedMetric} onChange={handleMetricChange}>
            <option value="">Choose a metric</option>
            {metrics.map((metric, index) => (
              <option key={index} value={metric}>
                {metric}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedExercise && selectedMetric && (
        <div>
          {selectedExercise && selectedMetric && (
            <div>
              <h3>Progress Graph</h3>
              <BarChart
                width={600}
                height={400}
                data={
                  progressData[selectedExercise] &&
                  progressData[selectedExercise][selectedMetric]
                    ? progressData[selectedExercise][selectedMetric].map(
                        (entry) => ({
                          date: entry.date,
                          value: entry.value,
                        }),
                      )
                    : []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="rgba(54, 162, 235, 0.5)"
                  stroke="rgba(54, 162, 235, 1)"
                  strokeWidth={1}
                  name={selectedMetric}
                />
              </BarChart>
            </div>
          )}

          <p>
            Display progress graph for {selectedMetric} of {selectedExercise}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
