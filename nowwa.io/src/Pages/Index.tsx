import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import Menu from './Menu';
import { Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Game, { GameLoad, GameStateDefault } from './Game';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Game';

type IndexState = {
    display: IndexDisplay
};

const IndexStateDefault:IndexState = {
    display   : 'None'
}

export interface IndexProps {
    SetDisplay: (display:IndexDisplay) => void
}

const Index = () => {

    const [state, setState] = useState(IndexStateDefault);

    const SetDisplay = (display:IndexDisplay) => {
        setState({
            display: display
        });
    };

    let menu = Menu({
        SetDisplay: SetDisplay
    });

    const [explorerState, setExplorerState] = useState(ExplorerStateDefault);
    let explorer;
    if (state.display == 'Explorer') {
        explorer = Explorer(explorerState, setExplorerState);
        console.log(`explorerState: ${explorerState.initialized}`);
    }

    const [gameState, setGameState] = useState(GameStateDefault);
    let game;
    if (state.display == 'Game') {
        game = Game(gameState, setGameState);
        console.log(`gameState: ${gameState.initialized}`);
    }
    useEffect(() => {
        if (state.display == 'Game' && !gameState.initialized) {
            console.log(`gameState: initialize`);
            GameLoad(gameState).then(setGameState);
        }
    }); 
    
    return (
        <Segment placeholder>
            <Top />
            {menu}
            {explorer}
            {game}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root'));
let index = <Index />;

root.render(index);