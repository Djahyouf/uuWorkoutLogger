import React from "react";
import { Link } from "react-router-dom";
import Calender from "./calender/Calender";
import logo from "./../css/logo.png";
import log from "./../css/log.png";
import progress from "./../css/progress.png";
import custom from "./../css/custom.png";
import "./../css/link-list.css";
import "./../css/home-page.css";

export default function HomePage(params) {
  return (
    <div className="HomePage">
      <div className="HomePageHeader">
        <h1>uuWorkoutLogger</h1>
      </div>

      <Calender />

      <ul className="link-list">
        <li>
          <Link to="/log" className="dom-link">
            <img src={log} className="link-logo" />
          </Link>
        </li>

        <li>
          <Link to="/custom" className="dom-link">
            <img src={custom} className="link-logo" />
          </Link>
        </li>

        <li>
          <Link to="/progress" className="dom-link">
            <img src={progress} className="link-logo" />
          </Link>
        </li>
      </ul>

      <img src={logo} alt="Logo" className="logo" />
    </div>
  );
}
