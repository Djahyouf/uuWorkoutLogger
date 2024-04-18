import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Modal from "react-modal";
import LogWorkout from "./components/logger";
import CustomExercise from "./components/custom_exercise";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/custom" element={<CustomExercise />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
