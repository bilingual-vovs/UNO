import React, { Component } from 'react';
import "./App.css"

import GameTable from './GameTable/GameTable';

class App extends Component {
    
    render() {
        return (
            <div id='app'>
                <GameTable/>
            </div>
        );
    }
}

export default App;
