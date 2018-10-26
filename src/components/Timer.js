import React from "react";
import moment from "moment";

const Timer = props => (
  <div className="timer">
    {typeof props.time === "number"
      ? moment.utc(props.time).format("mm:ss")
      : "--:--"}
  </div>
);

export default Timer;
