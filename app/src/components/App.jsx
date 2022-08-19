import React, { Component } from 'react';
import "./App.css"

import GameTable from './GameTable/GameTable';
import Alert from './Alert/Alert';

class App extends Component {
    state = {
        cardalert: false
    }
    alertIds = {
        cardalert: null
    }
    _unmountAlert(alert){
        clearInterval(this.alertIds[alert])
        this.setState({[alert]: false})
        console.log(this.state)
    }
    cardAlertPlay = ()=>{
        this._unmountAlert("cardalert")
        this.setState({cardalert: true})
        this.alertIds.cardalert = setInterval(() => {
            this._unmountAlert("cardalert")
        }, 1000);
    }

    render() {
        let {cardalert} = this.state
        return (
            <div id='app'>
                <GameTable cardAlert={this.cardAlertPlay} key='main'/>
                {cardalert ? <Alert id='cardalert' onStop text="You can not play this card"/>:""}
            </div>
        );
        
    }
}

export default App;
