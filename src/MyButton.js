import React from "react";
import "./MyButton.css";
class MyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const clicked = evt => {
      this.setState({ isActive: !this.state.isActive });
    };
    return (
      <div className="MyButton" onClick={clicked}>
        {this.props.label} {this.state.isActive ? "On" : "Off"}
      </div>
    );
  }
}
MyButton.defaultProps = {
  label: "No input"
};

export default MyButton;
