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
import Home, { HomeStateDefault } from './Home';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Test' | 'Login' | 'Register' | 'Home';

type Account = {
    id: string,
    token: string,
    name: string,
    admin: boolean
}

export type IndexState = {
    display: IndexDisplay,
    account?: Account
};

export const IndexStateDefault: IndexState = {
    display: 'Login'
}

export interface IndexProps {
    SetDisplay: (display: IndexDisplay) => void,
    SetAccount?: (account: Account) => void
}

const Index = () => {

    const [state, setState] = useState(IndexStateDefault);

    let url: URL = new URL(`${window.location.href}`);
    let message: string = '';
    let info: string = url.searchParams.get('info') as string;
    let error: string = url.searchParams.get('error') as string;
    let id: string = url.searchParams.get('id') as string;
    let token: string = url.searchParams.get('token') as string;
    let name: string = url.searchParams.get('name') as string;
    let admin: boolean = url.searchParams.get('admin') as string == "true";
    if (info == 'verified') {
        message = 'email successfully verified!';
    } else if (info == 'notverified') {
        message = 'failed to verify email';
    } else if (info == 'loggedin') {
        window.history.pushState("", "", `${window.location.origin}`);
        state.display = 'Home';
        state.account = {
            admin: admin,
            id: id,
            name: name,
            token: token
        };
    } else if (error) {
        message = error;
    }

    const SetDisplay = (display: IndexDisplay) => {
        setState({
            display: display
        });
    };

    let top;
    if (state.account && state.account.admin) {
        top = Top({
            SetDisplay: SetDisplay
        });
    }
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

    const [loginState, setLoginState] = useState(LoginStateDefault);
    let login;
    if (state.display == 'Login') {
        login = Login(loginState, setLoginState, setState);
        // console.log(`signinState: ${signinState.initialized}`);
    }

    const [registerState, setRegisterState] = useState(RegisterStateDefault);
    let register;
    if (state.display == 'Register') {
        register = Register(registerState, setRegisterState, {
            SetDisplay: SetDisplay
        });
        // console.log(`signupState: ${signupState.initialized}`);
    }

    const [homeState, setHomeState] = useState(HomeStateDefault);
    let home;
    if (state.account) {
        home = Home(homeState, setHomeState, state.account.name);
        // console.log(`homeState: ${homeState.initialized}`);
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
            {home}
            {top}
            {login}
            {register}
            {explorer}
            {build}
            {test}
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);