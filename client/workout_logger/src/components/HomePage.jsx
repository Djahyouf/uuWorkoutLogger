import React from "react";
import { Link } from "react-router-dom";
import Calender from "./calender/Calender";
import "./../css/link-list.css";

export default function HomePage(params) {
  return (
    <div className="HomePage">
      <h1>uuWorkoutLogger</h1>

      <Calender />

      <ul className="link-list">
        <li>
          <Link to="/log" className="dom-link">
            Log
          </Link>
        </li>
        <li>
          <Link to="/custom" className="dom-link">
            Create a custom exercise
          </Link>
        </li>
      </ul>
    </div>
  );
}
