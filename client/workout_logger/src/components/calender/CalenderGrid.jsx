import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import API from "./../../services/api";

const CalendarGrid = ({ currentMonth, currentYear }) => {
  const [workoutDays, setWorkoutDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [workoutInfo, setWorkoutInfo] = useState(null);

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
        {workoutInfo ? (
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
          </div>
        ) : (
          <p>No workout information available for this day.</p>
        )}
      </Modal>
    </div>
  );
};

export default CalendarGrid;
