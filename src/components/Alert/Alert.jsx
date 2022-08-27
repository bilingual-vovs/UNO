import React, { Component } from 'react';

import "./Alert.css"

class Alert extends Component {
    componentDidMount(){
        setTimeout(this.props.delete)
    }
    render() {
        return (
            <div id='alert'>
                <h1>{this.props.text}</h1>
                <button>Ok</button>
            </div>
        );
    }
}

export default Alert;
