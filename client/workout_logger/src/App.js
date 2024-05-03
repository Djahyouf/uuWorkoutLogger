import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Modal from "react-modal";
import LogWorkout from "./components/LogWorkout";
import CustomExercise from "./components/CustomExercise";
import ProgressTracker from "./components/ProgressTracker";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/custom" element={<CustomExercise />} />
          <Route path="/progress" element={<ProgressTracker />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
