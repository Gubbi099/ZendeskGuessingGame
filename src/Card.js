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
        <div className="back">
          <div className="imageBg">
            <img
              src="https://www.accodex.com/wp-content/uploads/2017/07/zendesk-logo-full-white.png"
              className="zendeskImg"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
