import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import API from "./../../services/api";

const CalendarGrid = ({ currentMonth, currentYear }) => {
  const [workoutDays, setWorkoutDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [workoutInfo, setWorkoutInfo] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modifiedWorkout, setModifiedWorkout] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, [currentMonth, currentYear, modalIsOpen]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchWorkouts = async () => {
    try {
      const workouts = await API.getWorkouts();
      const currentMonthWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        return (
          workoutDate.getFullYear() === currentYear &&
          workoutDate.getMonth() + 1 === currentMonth
        );
      });
      const workoutDates = currentMonthWorkouts.map((workout) =>
        new Date(workout.date).getDate(),
      );
      setWorkoutDays(workoutDates);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const fetchWorkoutInfo = async (selectedDay) => {
    try {
      const formattedDate = `${selectedDay}/${currentMonth}/${currentYear}`;
      const workouts = await API.getWorkouts();
      const workoutForSelectedDay = workouts.find(
        (workout) => new Date(workout.date).getDate() === selectedDay,
      );
      setWorkoutInfo(workoutForSelectedDay);
    } catch (error) {
      console.error("Error fetching workout info:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setModifiedWorkout({ ...workoutInfo });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    try {
      await API.updateWorkoutByDate(modifiedWorkout.date, modifiedWorkout);
      console.log("Workout modified successfully");
      setWorkoutInfo(modifiedWorkout);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error modifying workout:", error);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    fetchWorkoutInfo(day);
    setModalIsOpen(true);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const generateDaysArray = () => {
    const totalDays = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysArray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 1; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      daysArray.push(day);
    }

    while (daysArray.length % 7 !== 0) {
      daysArray.push(null);
    }

    return daysArray;
  };

  const daysArray = generateDaysArray();

  const deleteWorkout = async () => {
    console.log(workoutInfo.date);
    try {
      await API.deleteWorkoutByDate(workoutInfo.date);
      closeModal();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const modifyWorkout = () => {
    // Handle modification process here
    console.log("Modify workout:", workoutInfo.date);
    // You can open a modal or navigate to a new page for workout modification
  };

  return (
    <div className="calendar-grid">
      <div className="dates">
        {daysArray.map((day, index) => (
          <div
            key={index}
            className={
              workoutDays.includes(day)
                ? "workout-date"
                : day
                  ? "date"
                  : "empty"
            }
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Workout Information"
      >
        <h2>Workout Information</h2>

        {workoutInfo && !isEditMode && (
          <div>
            <p>Date: {workoutInfo.date}</p>
            <p>Volume: {workoutInfo.volume}</p>
            <h3>Exercises:</h3>
            <ul>
              {workoutInfo.exercises.map((exercise, index) => (
                <li key={index}>
                  <strong>{exercise.name}</strong>
                  <ul>
                    {exercise.sets.map((set, index) => (
                      <li key={index}>
                        Reps: {set.reps}, Weight: {set.weight}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button onClick={deleteWorkout}>Delete Workout</button>
            <button onClick={handleEditClick}>Edit Workout</button>
          </div>
        )}

        {workoutInfo && isEditMode && (
          <div>
            <h2>Edit Workout</h2>
            {/* Input fields for modifying workout information */}
            <input
              type="text"
              value={modifiedWorkout.date}
              onChange={(e) =>
                setModifiedWorkout({
                  ...modifiedWorkout,
                  date: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={modifiedWorkout.volume}
              onChange={(e) =>
                setModifiedWorkout({
                  ...modifiedWorkout,
                  volume: e.target.value,
                })
              }
            />
            {/* Input fields for modifying exercises */}
            {modifiedWorkout.exercises.map((exercise, index) => (
              <div key={index}>
                <h3>{exercise.name}</h3>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex}>
                    <input
                      type="text"
                      value={set.reps}
                      onChange={(e) =>
                        setModifiedWorkout((prevState) => {
                          const updatedExercise = [...prevState.exercises];
                          updatedExercise[index].sets[setIndex].reps =
                            e.target.value;
                          return { ...prevState, exercises: updatedExercise };
                        })
                      }
                    />
                    <input
                      type="text"
                      value={set.weight}
                      onChange={(e) =>
                        setModifiedWorkout((prevState) => {
                          const updatedExercise = [...prevState.exercises];
                          updatedExercise[index].sets[setIndex].weight =
                            e.target.value;
                          return { ...prevState, exercises: updatedExercise };
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={handleSaveEdit}>Save Changes</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        )}

        {!workoutInfo && <p>No workout information available for this day.</p>}
      </Modal>
    </div>
  );
};

export default CalendarGrid;
