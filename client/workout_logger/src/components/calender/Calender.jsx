import React, { useState, useEffect } from "react";
import CalenderGrid from "./CalenderGrid";
import "./../../css/calender.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 1) {
        setCurrentYear(currentYear - 1);
        return 12;
      } else {
        return prevMonth - 1;
      }
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 12) {
        setCurrentYear(currentYear + 1);
        return 1;
      } else {
        return prevMonth + 1;
      }
    });
  };

  return (
    <div className="calender-container">
      <div className="calendar">
        <div className="navigation">
          <button onClick={prevMonth}>&lt;</button>
          <h2>
            {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calender-content">
          <CalenderGrid
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
