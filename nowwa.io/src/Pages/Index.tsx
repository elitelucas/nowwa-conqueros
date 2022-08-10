import React, { useState } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import Menu from './Menu';
import { Segment } from 'semantic-ui-react';
import Explorer, { ExplorerPropsDefault } from './Explorer';
import Game, { GamePropsDefault } from './Game';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Game';

type IndexState = {
    display: IndexDisplay
};

export interface IndexProps {
    SetDisplay: (display:IndexDisplay) => void
}

const Index = () => {
    let initialState:IndexState = {
        display: 'None'
    };

    const [state, setState] = useState(initialState);

    const SetDisplay = (display:IndexDisplay) => {
        setState({
            display: display
        });
    };

    let menu = Menu({
        SetDisplay: SetDisplay
    });

    let explorer = Explorer(ExplorerPropsDefault);
    let game = Game(GamePropsDefault);

    return (
        <Segment placeholder>
            <Top />
            {menu}
            {state.display == 'Explorer' && explorer}
            {state.display == 'Game' && game}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root'));
let index = <Index />;

root.render(index);