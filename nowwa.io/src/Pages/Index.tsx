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
import { ComponentState, UpdateComponentState } from './Utils';

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
    display: 'Login',
}

export interface IndexProps {
    SetAccount?: (account: Account) => void
    UpdateState: (newState: Partial<IndexState>) => void
}

const GetUrlSearchParams = (url: string = window.location.href) => {
    let params: { [key: string]: any } = {};
    new URL(url).searchParams.forEach(function (val, key) {
        if (params[key] !== undefined) {
            if (!Array.isArray(params[key])) {
                params[key] = [params[key]];
            }
            params[key].push(val);
        } else {
            params[key] = val;
        }
    });
    return params;
}


const Index = () => {

    // type newType = ComponentState & {
    //     key1: string,
    //     key2: boolean
    // };
    // let test01: newType = { busy: true, initialized: false, key1: "hehe", key2: false };
    // console.log(`test01: ${JSON.stringify(test01)}`);
    // test01 = UpdateComponentState<newType>(test01, {
    //     busy: false,
    //     key1: "huhu"
    // });
    // console.log(`test01: ${JSON.stringify(test01)}`);

    const [state, setState] = useState(IndexStateDefault);

    let params: { [key: string]: any } = GetUrlSearchParams(window.location.href);
    let message: string = '';
    if (params.info == 'verified') {
        message = 'email successfully verified!';
    } else if (params.info == 'notverified') {
        message = 'failed to verify email';
    } else if (params.info == 'loggedin') {
        window.history.pushState("", "", `${window.location.origin}`);
        state.display = 'Home';
        state.account = {
            admin: params.admin as string == 'true',
            id: params.id,
            name: params.name,
            token: params.token
        };
    } else if (params.error) {
        message = params.error;
    }

    const updateState = (updates: Partial<IndexState>) => {
        let newState = UpdateComponentState<IndexState>(state, updates);
        setState(newState);
    };

    let top;
    if (state.account && state.account.admin) {
        top = Top(updateState);
    }
    const [explorerState, setExplorerState] = useState(ExplorerStateDefault);
    let explorer;
    if (state.display == 'Explorer') {
        explorer = Explorer(explorerState, setExplorerState);
    }

    const [gameState, setGameState] = useState(BuildStateDefault);
    const [gameStatus, setGameStatus] = useState(Status.DetailDefault);
    let build;
    if (state.display == 'Build') {
        build = Builds(gameState, setGameState, gameStatus, setGameStatus);
    }

    const [loginState, setLoginState] = useState(LoginStateDefault);
    let login;
    if (state.display == 'Login') {
        login = Login(loginState, setLoginState, updateState);
    }

    const [registerState, setRegisterState] = useState(RegisterStateDefault);
    let register;
    if (state.display == 'Register') {
        register = Register(registerState, setRegisterState, updateState);
    }

    const [homeState, setHomeState] = useState(HomeStateDefault);
    let home;
    if (state.account) {
        home = Home(homeState, setHomeState, state.account.name);
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
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);