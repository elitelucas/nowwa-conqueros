import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import { Header, Icon, Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Build, { GameLoad, GameStateDefault } from './Build';
import PlayCanvas from '../Core/Playcanvas';

type IndexDisplay = 'None' | 'Explorer' | 'Build';

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

    let top = Top({
        SetDisplay: SetDisplay
    });

    const [explorerState, setExplorerState] = useState(ExplorerStateDefault);
    let explorer;
    if (state.display == 'Explorer') {
        explorer = Explorer(explorerState, setExplorerState);
        // console.log(`explorerState: ${explorerState.initialized}`);
        // console.log(`explorerState focusFile: ${explorerState.focusFile}`);
    }

    const [gameState, setGameState] = useState(GameStateDefault);
    const [gameBusy, setGameBusy] = useState(PlayCanvas.StatusDefault);
    let game;
    if (state.display == 'Build') {
        game = Build(gameState, setGameState, gameBusy, setGameBusy);
        // console.log(`gameState: ${gameState.initialized}`);
    }
    
    return (
        <Segment placeholder>
            <Segment placeholder>
                <Header icon>
                    <Icon name='earlybirds' />
                    Nowwa IO
                </Header>
            </Segment>
            {top}
            {explorer}
            {game}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);