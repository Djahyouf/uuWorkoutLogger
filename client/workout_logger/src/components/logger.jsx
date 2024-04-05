import React, { useState, useEffect } from "react";
import Modal from "react-modal";

function LogWorkout() {
  const [exercises, setExercises] = useState([
    { exercise: "", sets: [{ reps: "", weight: "" }] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState({});
  const [routineName, setRoutineName] = useState("");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/exercises");
      const data = await response.json();
      setExerciseOptions(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleExerciseChange = (exerciseIndex, selectedExercise) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].exercise = selectedExercise;
    setExercises(updatedExercises);
  };

  const handleRepsChange = (exerciseIndex, setIndex, e) => {
    const { value } = e.target;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = value;
    setExercises(updatedExercises);
  };

  const handleWeightChange = (exerciseIndex, setIndex, e) => {
    const { value } = e.target;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].weight = value;
    setExercises(updatedExercises);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: "", weight: "" });
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { exercise: "", sets: [{ reps: "", weight: "" }] },
    ]);
  };

  const removeExercise = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setExercises(updatedExercises);
  };

  const calculateTotalVolume = () => {
    // Logic to calculate total volume
    return 0;
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const saveWorkout = async () => {
    try {
      setIsLoading(true);

      const formattedWorkout = {
        date: new Date().toISOString(),
        volume: calculateTotalVolume(),
        exercises: exercises.map((exercise) => ({
          name: exercise.exercise,
          sets: exercise.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })),
        })),
      };

      const response = await fetch("http://localhost:3001/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedWorkout),
      });

      if (!response.ok) {
        throw new Error(
          `Error logging workout: ${response.status} - ${response.statusText}`,
        );
      }

      console.log("Workout logged successfully");
      closeModal();
    } catch (error) {
      console.error("Error logging workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoutineFromWorkout = async () => {
    try {
      setIsLoading(true);

      const formattedRoutine = {
        name: routineName,
        exercises: exercises
          .filter((exercise) => exercise.exercise.trim() !== "")
          .map((exercise) => ({
            name: exercise.exercise,
            sets: exercise.sets,
          })),
      };

      const response = await fetch("http://localhost:3001/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedRoutine),
      });

      if (!response.ok) {
        throw new Error(
          `Error creating routine: ${response.status} - ${response.statusText}`,
        );
      }

      console.log("Routine created successfully");
      closeModal();
    } catch (error) {
      console.error("Error creating routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Logging</h1>
      <button onClick={() => setModalIsOpen(true)}>Log Workout</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Log Workout</h2>
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex}>
            <label>Select Exercise:</label>
            <select
              value={exercise.exercise}
              onChange={(e) =>
                handleExerciseChange(exerciseIndex, e.target.value)
              }
            >
              <option value="">Select an exercise</option>
              {Object.keys(exerciseOptions).map((muscleGroup) => (
                <optgroup label={muscleGroup} key={muscleGroup}>
                  {exerciseOptions[muscleGroup].map((optionExercise) => (
                    <option key={optionExercise.id} value={optionExercise.name}>
                      {optionExercise.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button onClick={() => removeExercise(exerciseIndex)}>
              Remove Exercise
            </button>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex}>
                <input
                  type="text"
                  value={set.reps}
                  onChange={(e) => handleRepsChange(exerciseIndex, setIndex, e)}
                />
                {!exerciseOptions[exercise.exercise] && (
                  <input
                    type="text"
                    value={set.weight}
                    onChange={(e) =>
                      handleWeightChange(exerciseIndex, setIndex, e)
                    }
                  />
                )}
                <button onClick={() => removeSet(exerciseIndex, setIndex)}>
                  Remove Set
                </button>
              </div>
            ))}
            <button onClick={() => addSet(exerciseIndex)}>Add Set</button>
          </div>
        ))}
        <button onClick={addExercise}>Add Exercise</button>
        <button onClick={saveWorkout} disabled={isLoading}>
          Log Workout
        </button>
        <input
          type="text"
          placeholder="Enter routine name"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />
        <button onClick={createRoutineFromWorkout} disabled={isLoading}>
          Create Routine from Workout
        </button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default LogWorkout;
