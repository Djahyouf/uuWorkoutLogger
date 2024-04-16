import React, { useState, useEffect } from "react";
import Modal from "react-modal";

function CreateCustomWorkout() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

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

  const createCustomExercise = async () => {
    const { name, muscle_group, difficulty_level } = customExerciseData;
    if (!name || !muscle_group || !difficulty_level) {
      setIsEmptyField(true);
      return;
    }

    console.log(customExerciseData);
    console.log(JSON.stringify(customExerciseData));
    const parsedCustomExerciseData = JSON.stringify(customExerciseData);

    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:3001/api/custom-exercises",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: parsedCustomExerciseData,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error creating custom exercise: ${response.status} - ${response.statusText}`,
        );
      }

      const responseData = await response.json();
      console.log("Custom exercise created successfully:", responseData);
      closeModal();
    } catch (error) {
      console.error("Error creating custom exercise:", error);
    } finally {
      setIsLoading(false);
      setIsEmptyField(false);
    }
  };

  const difficultyLevels = ["easy", "medium", "hard", "extreme"];
  const rangeOfMotions = ["static", "partial", "full"];
  const isolationOrCompound = ["isolation", "compound"];

  return (
    <div>
      <button onClick={openModal} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Custom Exercise"}
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
    </div>
  );
}

export default CreateCustomWorkout;
