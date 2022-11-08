import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import { Header, Icon, Message, Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Builds, { BuildStateDefault } from './Builds';
import 'semantic-ui-css/semantic.css';
import Login, { LoginStateDefault } from './Login';
import Register, { RegisterStateDefault } from './Register';
import Home, { HomeStateDefault } from './Home';
import { ComponentState, UpdateComponentState } from './Utils';
import Status from '../Core/APPS/Status';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Test' | 'Login' | 'Register' | 'Home';

type Account = {
    id: string,
    token: string,
    name: string,
    admin: boolean,
    friend_count: number
}

export type IndexState = ComponentState & {
    display: IndexDisplay,
    account?: Account,
    message: string,
    params?: { [key: string]: any }
};

export const IndexStateDefault: IndexState = {
    display: 'Login',
    initialized: false,
    busy: false,
    message: ``
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

    const [state, setState] = useState(IndexStateDefault);

    const updateState = (updates: Partial<IndexState>) => {
        let newState = UpdateComponentState<IndexState>(state, updates);
        setState(newState);
    };

    if (!state.initialized) {
        let params: { [key: string]: any } = GetUrlSearchParams(window.location.href);
        window.history.pushState(params, "", `${window.location.origin}`);
        if (params.info == 'verified') {
            updateState({
                message: `email successfully verified!`
            });
        } else if (params.info == 'notverified') {
            updateState({
                message: `failed to verify email`
            });
        } else if (params.info == 'loggedin') {
            updateState({
                display: 'Home',
                account: {
                    admin: params.admin as string == 'true',
                    id: params.id,
                    name: params.name,
                    token: params.token,
                    friend_count: parseInt(params.friend_count as string || "0")
                }
            });
        } else if (params.info == 'discord') {
            updateState({
                message: params.detail
            });
        } else if (params.error) {
            updateState({
                message: `${params.error}`
            });
        }
    }

    let top: JSX.Element = <></>;
    if (state.account && state.account.admin) {
        top = Top(updateState);
    }
    const [explorerState, setExplorerState] = useState(ExplorerStateDefault);
    let explorer: JSX.Element = <></>;
    if (state.display == 'Explorer') {
        explorer = Explorer(explorerState, setExplorerState);
    }

    const [gameState, setGameState] = useState(BuildStateDefault);
    const [gameStatus, setGameStatus] = useState(Status.DetailDefault);
    let build: JSX.Element = <></>;
    if (state.display == 'Build') {
        build = Builds(gameState, setGameState, gameStatus, setGameStatus);
    }

    const [loginState, setLoginState] = useState(LoginStateDefault);
    let login: JSX.Element = <></>;
    if (state.display == 'Login') {
        login = Login(loginState, setLoginState, state, updateState);
    }

    const [registerState, setRegisterState] = useState(RegisterStateDefault);
    let register: JSX.Element = <></>;
    if (state.display == 'Register') {
        register = Register(registerState, setRegisterState, state, updateState);
    }

    const [homeState, setHomeState] = useState(HomeStateDefault);
    let home: JSX.Element = <></>;
    if (state.account) {
        home = Home(homeState, setHomeState, state);
    }

    return (
        <Segment placeholder>
            {!state.account && <>
                <Segment placeholder>
                    <Header icon>
                        <Icon name='earlybirds' />
                        Nowwa IO
                    </Header>
                    {state.message.length > 0 && <Message>{state.message}</Message>}
                </Segment>
            </>}
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