import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from 'react-modal';

function App() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [customExerciseData, setCustomExerciseData] = useState({
        name: '',
        muscle_group: '',
        difficulty_level: ''
    });
    const [isEmptyField, setIsEmptyField] = useState(false);

    useEffect(() => {
        Modal.setAppElement('#root');
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
        const parsedCustomExerciseData =  JSON.stringify(customExerciseData);

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/custom-exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: parsedCustomExerciseData
            });

            if (!response.ok) {
                throw new Error(`Error creating custom exercise: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Custom exercise created successfully:', responseData);
            closeModal();
        } catch (error) {
            console.error('Error creating custom exercise:', error);
        } finally {
            setIsLoading(false);
            setIsEmptyField(false);
        }
    };


    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/exercises');
            const jsonData = await response.json();
            console.log('Fetched data:', jsonData);
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Exercise Data</h1>
                <button onClick={fetchData} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Fetch Data'}
                </button>
                <button onClick={openModal} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Custom Exercise'}
                </button>
                <ul>
                    {Object.values(data).flatMap(exercises => exercises.map((exercise, index) => (
                        <li key={index}>{exercise.name}</li>
                    )))}
                </ul>
            </header>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Create Custom Exercise Modal"
            >
                <h2>Create Custom Exercise</h2>
                <form>
                    <label>Name:</label>
                    <input type="text" name="name" value={customExerciseData.name} onChange={handleInputChange} />
                    <label>Muscle Group:</label>
                    <input type="text" name="muscle_group" value={customExerciseData.muscle_group} onChange={handleInputChange} />
                    <label>Difficulty:</label>
                    <input type="text" name="difficulty_level" value={customExerciseData.difficulty_level} onChange={handleInputChange} />
                    {isEmptyField && <p>Please fill in all fields.</p>}
                    <button type="button" onClick={createCustomExercise}>Save</button>
                </form>
            </Modal>
        </div>
    );
}

export default App;

