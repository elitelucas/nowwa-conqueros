import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import { Header, Icon, Message, Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Builds, { BuildStateDefault } from './Builds';
import Status from '../Core/Status';
import 'semantic-ui-css/semantic.css';
import Test, { TestStateDefault } from './Test';
import Login, { LoginStateDefault } from './Login';
import Register, { RegisterStateDefault } from './Register';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Test' | 'Login' | 'Register';

type IndexState = {
    display: IndexDisplay
};

const IndexStateDefault: IndexState = {
    display: 'Login'
}

export interface IndexProps {
    SetDisplay: (display: IndexDisplay) => void
}

const Index = () => {

    let url: URL = new URL(`${window.location.href}`);
    let message: string = '';
    let info: string = url.searchParams.get('info') as string;
    let error: string = url.searchParams.get('error') as string;
    if (info == 'verified') {
        message = 'email successfully verified!';
    } else if (info == 'notverified') {
        message = 'failed to verify email';
    } else if (error) {
        message = error;
    }

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
    let build;
    if (state.display == 'Build') {
        build = Builds(gameState, setGameState, gameStatus, setGameStatus);
        // console.log(`gameState: ${gameState.initialized}`);
    }

    const [testState, setTestState] = useState(TestStateDefault);
    let test;
    if (state.display == 'Test') {
        test = Test(testState, setTestState);
        // console.log(`gameState: ${gameState.initialized}`);
    }

    const [signinState, setSignInState] = useState(LoginStateDefault);
    let signin;
    if (state.display == 'Login') {
        signin = Login(signinState, setSignInState, {
            SetDisplay: SetDisplay
        });
        // console.log(`signinState: ${signinState.initialized}`);
    }

    const [signupState, setSignUpState] = useState(RegisterStateDefault);
    let signup;
    if (state.display == 'Register') {
        signup = Register(signupState, setSignUpState, {
            SetDisplay: SetDisplay
        });
        // console.log(`signupState: ${signupState.initialized}`);
    }

    return (
        <Segment placeholder>
            <Segment placeholder>
                <Header icon>
                    <Icon name='earlybirds' />
                    Nowwa IO
                </Header>
                {message.length > 0 && <Message>{message}</Message>}
            </Segment>
            {(state.display != 'Login' && state.display != 'Register' && state.display != 'None') && top}
            {signin}
            {signup}
            {explorer}
            {build}
            {test}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);