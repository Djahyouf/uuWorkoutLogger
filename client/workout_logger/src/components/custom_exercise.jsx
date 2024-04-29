import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReturnButton from "./fixed/returnButton";
import API from "./../services/api";
import "./../css/header.css";
import "./../css/button.css";

export default function CreateCustomExercise() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [customExerciseData, setCustomExerciseData] = useState({
    name: "",
    muscle_group: "",
    difficulty_level: "",
    equipement: "",
    bodyweight: false,
    isolation_vs_compound: "",
    range_of_motion: "",
  });
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [selectedCustomExercise, setSelectedCustomExercise] = useState(null);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const openViewModal = () => {
    setViewModalIsOpen(true);
    fetchData();
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomExerciseData({ ...customExerciseData, [name]: value });
  };

  const handleSelectCustomExercise = (exercise) => {
    setSelectedCustomExercise(exercise);
  };

  const renderCustomExercises = () => {
    return (
      <div>
        {data.map((exercise) => (
          <div key={exercise.id}>
            <p>{exercise.name}</p>
            <button onClick={() => deleteCustomExercise(exercise.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };

  const deleteCustomExercise = async (exerciseId) => {
    try {
      setIsLoading(true);
      await API.deleteCustomExercise(exerciseId);
      console.log("Custom exercise deleted successfully");
      fetchData(); // Refresh custom exercises data after deletion
    } catch (error) {
      console.error("Error deleting custom exercise:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomExercise = async () => {
    const { name, muscle_group, difficulty_level } = customExerciseData;

    try {
      setIsLoading(true);
      await API.createCustomExercise(customExerciseData);
      console.log("Custom exercise created successfully:", customExerciseData);
      closeModal();
    } catch (error) {
      console.error("Error creating custom exercise:", error);
    } finally {
      setIsLoading(false);
      setIsEmptyField(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const customExercises = await API.getCustomExercises();
      setData(customExercises);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching custom exercises:", error);
      setIsLoading(false);
    }
  };

  const difficultyLevels = ["easy", "medium", "hard", "extreme"];
  const rangeOfMotions = ["static", "partial", "full"];
  const isolationOrCompound = ["isolation", "compound"];

  return (
    <div>
      <ReturnButton />
      <div className="Header">
        <h1>Custom Exercise</h1>
      </div>
      <button className="button-24" onClick={openModal} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Custom Exercise"}
      </button>

      <button className="button-24" onClick={openViewModal} disabled={isLoading}>
        {isLoading ? "Loading..." : "View Custom Exercises"}
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Custom Exercise Modal"
      >
        <h2>Create Custom Exercise</h2>
        <form>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={customExerciseData.name}
            onChange={handleInputChange}
          />
          <label>Muscle Group:</label>
          <input
            type="text"
            name="muscle_group"
            value={customExerciseData.muscle_group}
            onChange={handleInputChange}
          />
          <label>Difficulty:</label>
          <select
            name="difficulty_level"
            value={customExerciseData.difficulty_level}
            onChange={handleInputChange}
          >
            {difficultyLevels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
          <label>Equipment:</label>
          <input
            type="text"
            name="equipement"
            value={customExerciseData.equipement}
            onChange={handleInputChange}
          />
          <label>Bodyweight:</label>
          <input
            type="checkbox"
            name="bodyweight"
            checked={customExerciseData.bodyweight}
            onChange={() =>
              setCustomExerciseData({
                ...customExerciseData,
                bodyweight: !customExerciseData.bodyweight,
              })
            }
          />
          <label>Isolation vs Compound:</label>
          <select
            name="isolation_vs_compound"
            value={customExerciseData.isolation_vs_compound}
            onChange={handleInputChange}
          >
            {isolationOrCompound.map((motion, index) => (
              <option key={index} value={motion}>
                {motion}
              </option>
            ))}
          </select>

          <label>Range of Motion:</label>
          <select
            name="range_of_motion"
            value={customExerciseData.range_of_motion}
            onChange={handleInputChange}
          >
            {rangeOfMotions.map((motion, index) => (
              <option key={index} value={motion}>
                {motion}
              </option>
            ))}
          </select>
          {isEmptyField && <p>Please fill in all fields.</p>}
          <button type="button" onClick={createCustomExercise}>
            Save
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Custom Exercises Modal"
      >
        <h2>Custom Exercises</h2>
        {isLoading ? (
          <p>Loading custom exercises...</p>
        ) : (
          renderCustomExercises()
        )}
      </Modal>
    </div>
  );
}
