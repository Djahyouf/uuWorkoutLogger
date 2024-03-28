import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
                <ul>
                    {Object.values(data).flatMap(exercises => exercises.map((exercise, index) => (
                        <li key={index}>{exercise.name}</li>
                    )))}
                </ul>
            </header>
        </div>
    );
}

export default App;

