import React from "react";
import moment from "moment";

const Timer = props => (
  <div className="timer">
    {typeof props.time === "number"
      ? moment.utc(props.time).format("mm:ss")
      : "00:00"}
  </div>
);

export default Timer;
