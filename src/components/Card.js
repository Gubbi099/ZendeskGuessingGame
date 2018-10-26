import React from "react";
import "./Card.css";
import bglogo from "../zenlogo.png";

class Card extends React.Component {
  constructor(props) {
    super(props);
    const TILT_AMOUNT = 10;
    this.rotationStyle = `rotateZ(${Math.round(
      -TILT_AMOUNT + TILT_AMOUNT * 2 * Math.random()
    )}deg)`;
  }

  render() {
    const className = this.props.flipped ? "card flipped" : "card";

    return (
      <div
        className={className}
        onClick={this.props.onClick}
        style={{ transform: this.rotationStyle }}
      >
        <div
          className="front"
          style={{ backgroundImage: `url(${this.props.image})` }}
        />

        <div className="back">
          <div className="imageBg">
            <img src={bglogo} className="zendeskImg" alt="Hmmmmmm" />
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
