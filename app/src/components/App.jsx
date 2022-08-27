import React, { Component } from 'react';
import "./App.css"

import GameTable from './GameTable/GameTable';
import Alert from './Alert/Alert';
import GamePreview from './GamePreview/GamePreview';

class App extends Component {
    state = {
        cardalert: false,
        gamestarted: false
    }
    alertIds = {
        cardalert: null
    }
    _unmountAlert(alert){
        clearInterval(this.alertIds[alert])
        this.setState({[alert]: false})
    }
    cardAlertPlay = ()=>{
        this._unmountAlert("cardalert")
        this.setState({cardalert: true})
        this.alertIds.cardalert = setInterval(() => {
            this._unmountAlert("cardalert")
        }, 1000);
    }

    start = ()=>{
        this.setState({gamestarted: true})
    }

    render() {
        let {cardalert, gamestarted} = this.state
        if (gamestarted){
            return (
                <div id='app'>
                    <GameTable cardAlert={this.cardAlertPlay} key='main'/>
                    {cardalert ? <Alert id='cardalert' onStop text="You can not play this card"/>:""}
                </div>
            );
            }
            else{
                return <GamePreview start={this.start}/>
            }
        
        
    }
}

export default App;
