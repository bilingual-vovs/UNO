import React, { Component } from 'react';

class Alert extends Component {
    componentDidMount(){
        setTimeout(this.props.delete)
    }
    render() {
        return (
            <div id='alert'>
                <h1>You can NOT play this card</h1>
            </div>
        );
    }
}

export default Alert;
