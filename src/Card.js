import React from "react";
import "./Card.css";
class Card extends React.Component {
  render() {
    const className = this.props.flipped ? "card flipped" : "card";

    return (
      <div className={className} onClick={this.props.onClick}>
        <div
          className="front"
          style={{ backgroundImage: `url(${this.props.image})` }}
        />
        <div className="back" />
      </div>
    );
  }
}

export default Card;
