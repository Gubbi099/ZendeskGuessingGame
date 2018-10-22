import React from 'react'
import './MyButton.css'
class MyButton extends React.Component {

    render() {
      const clicked = (evt) => {
        if (this.props.label == "No input") {
          alert(this.props.label)
        }


      }
      const label = this.props.label
      console.log(this.props.children)
      return (

        <div className="MyButton" onClick={clicked}>
            {label}
        </div>
      )


    }
}
MyButton.defaultProps = {
    label: "No input"

}

export default MyButton;
