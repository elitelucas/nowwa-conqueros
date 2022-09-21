import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import { Header, Icon, Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Builds, { BuildStateDefault } from './Builds';
import Status from '../Core/Status';
import 'semantic-ui-css/semantic.css';
import Test, { TestStateDefault } from './Test';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Test';

type IndexState = {
    display: IndexDisplay
};

const IndexStateDefault: IndexState = {
    display: 'None'
}

export interface IndexProps {
    SetDisplay: (display: IndexDisplay) => void
}

const Index = () => {

    const [state, setState] = useState(IndexStateDefault);

    const SetDisplay = (display: IndexDisplay) => {
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

    const [gameState, setGameState] = useState(BuildStateDefault);
    const [gameStatus, setGameStatus] = useState(Status.DetailDefault);
    let game;
    if (state.display == 'Build') {
        game = Builds(gameState, setGameState, gameStatus, setGameStatus);
        // console.log(`gameState: ${gameState.initialized}`);
    }

    const [testState, setTestState] = useState(TestStateDefault);
    let test;
    if (state.display == 'Test') {
        test = Test(testState, setTestState);
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
            {test}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);