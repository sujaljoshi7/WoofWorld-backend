import React, { useState } from "react";

function DurationSelector({ setEventDuration }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleChange = (type, value) => {
    if (type === "hours") setHours(value);
    else setMinutes(value);

    // Update the duration in parent component
    setEventDuration(`${value} ${type}`);
  };

  return (
    <div>
      <label className="form-label">Duration:</label>
      <div className="row">
        <div className="col-6">
          <select
            className="form-select"
            value={hours}
            onChange={(e) => handleChange("hours", e.target.value)}
          >
            {[...Array(24).keys()].map((h) => (
              <option key={h} value={h}>
                {h} Hours
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <select
            className="form-select"
            value={minutes}
            onChange={(e) => handleChange("minutes", e.target.value)}
          >
            {[0, 15, 30, 45].map((m) => (
              <option key={m} value={m}>
                {m} Minutes
              </option>
            ))}
          </select>
        </div>
      </div>

      <p>
        Selected Duration: {hours} hours {minutes} minutes
      </p>
    </div>
  );
}

export default DurationSelector;
