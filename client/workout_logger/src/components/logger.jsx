import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReturnButton from "./fixed/returnButton";
import API from "./../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../css/header.css";
import "./../css/button.css";

function LogWorkout() {
  const [exercises, setExercises] = useState([
    { exercise: "", sets: [{ reps: "", weight: "" }] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState({});
  const [routineName, setRoutineName] = useState("");
  const [routineModalIsOpen, setRoutineModalIsOpen] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchExercises();
    fetchRoutines();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await API.getExercises();
      setExerciseOptions(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const fetchRoutines = async () => {
    try {
      setIsLoading(true);
      const data = await API.getRoutines();
      setRoutines(data);
    } catch (error) {
      console.error("Error fetching routines:", error);
    } finally {
      setIsLoading(false);
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

  const openRoutineModal = () => {
    setRoutineModalIsOpen(true);
  };

  const closeRoutineModal = () => {
    setRoutineModalIsOpen(false);
  };

  const saveWorkout = async () => {
    try {
      setIsLoading(true);

      const formattedWorkout = {
        date: selectedDate.toISOString(),
        volume: calculateTotalVolume(),
        exercises: exercises.map((exercise) => ({
          name: exercise.exercise,
          sets: exercise.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })),
        })),
      };

      await API.createWorkout(formattedWorkout);
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

      if (!routineName.trim()) {
        throw new Error("Routine name cannot be empty");
      }

      const formattedRoutine = {
        name: routineName,
        exercises: exercises
          .filter((exercise) => exercise.exercise.trim() !== "")
          .map((exercise) => ({
            name: exercise.exercise,
            sets: exercise.sets,
          })),
      };

      await API.createRoutine(formattedRoutine);
      console.log("Routine created successfully");
      closeModal();
    } catch (error) {
      console.error("Error creating routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRoutine = (routineId) => {
    const selected = routines.find((routine) => routine.id === routineId);
    setSelectedRoutine(selected);
    closeRoutineModal();
  };

  useEffect(() => {
    if (selectedRoutine) {
      const updatedExercises = selectedRoutine.exercises.map((exercise) => ({
        exercise: exercise.name,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
        })),
      }));
      setExercises(updatedExercises);
    }
  }, [selectedRoutine]);

  return (
    <div>
      <ReturnButton />

      <div className="Header">
        <h1>Logging</h1>
      </div>

      <button className="button-24" onClick={() => setModalIsOpen(true)}>Log Workout</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Log Workout</h2>

        <button onClick={openRoutineModal}>Perform a routine</button>

        {/* Routine selection modal */}
        <Modal isOpen={routineModalIsOpen} onRequestClose={closeRoutineModal}>
          <h2>Select Routine</h2>
          {isLoading ? (
            <p>Loading routines...</p>
          ) : (
            <ul>
              {routines.map((routine) => (
                <li key={routine.id}>
                  <button onClick={() => selectRoutine(routine.id)}>
                    {routine.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

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
