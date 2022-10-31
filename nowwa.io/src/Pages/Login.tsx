import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { authenticationLoginUrl, authenticationRegisterUrl, twitterAuthUrl } from '../Core/CONFIG/Environment';
import { IndexProps, IndexState, } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';
import { UpdateComponentState } from './Utils';

export type LoginState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    warning: string,
    twitter: string
}

export const LoginStateDefault: LoginState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    warning: '',
    twitter: ''
}

export const LoginInit = (state: LoginState): Promise<LoginState> => {
    return new Promise((resolve, reject) => {
        let url: URL = new URL(`${window.location.origin}${twitterAuthUrl}`);
        let init: RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        };
        fetch(url, init)
            .then(res => res.json())
            .then((res: any) => {
                if (res.success) {
                    resolve({
                        email: state.email,
                        initialized: true,
                        isBusy: false,
                        password: '',
                        warning: '',
                        twitter: res.link
                    });
                }
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
                reject(error);
            });
    });
};

const Login = (state: LoginState, setState: React.Dispatch<React.SetStateAction<LoginState>>, setIndexState: (updates: Partial<IndexState>) => void) => {

    if (!state.initialized) {
        LoginInit(state).then(setState);
    }

    let updateState = (updates: Partial<LoginState>) => {
        let newState = UpdateComponentState<LoginState>(state, updates);
        setState(newState);
    };

    let setEmail = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            email: data.value
        });
    };

    let setPassword = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            password: data.value
        });
    };

    let setWarning = (warning: string) => {
        updateState({
            warning: warning
        });
    };

    let goToRegister = () => {
        window.history.pushState("", "", `${window.location.origin}`);
        updateState(LoginStateDefault);
        setIndexState({
            display: 'Register',
            message: ''
        });
    };

    let doLogin = () => {
        if (state.email.length == 0) {
            setWarning('email cannot be empty!');
        } else if (state.password.length == 0) {
            setWarning('password cannot be empty!');
        } else {
            // window.history.pushState("", "", `${window.location.origin}`);
            updateState({
                isBusy: true,
                warning: '',
            });
            let url: URL = new URL(`${window.location.origin}${authenticationLoginUrl}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`login response: ${JSON.stringify(res)}`);
                    if (res.success) {
                        console.log(res.value);
                        if (res.value.admin) {
                            setIndexState({
                                display: 'Build',
                                account: res.value
                            });
                        } else {
                            setIndexState({
                                display: 'Home',
                                account: res.value
                            });
                        }
                    } else {
                        updateState({
                            isBusy: false,
                            warning: res.error,
                        });
                    }
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
        }
    };

    let doTwitter = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.twitter);
    };

    return (
        <Segment placeholder>
            <Form warning={state.warning.length > 0}>
                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Header textAlign='center'>Login</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Email
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='email'
                                placeholder='email'
                                onChange={setEmail}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Password
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='password'
                                placeholder='password'
                                onChange={setPassword}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center' width='8'>
                            <Message
                                warning
                                content={state.warning}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={doLogin} disabled={state.isBusy}><Icon name='sign in'></Icon>Login</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={goToRegister} disabled={state.isBusy}><Icon name='signup'></Icon>Register</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Or</Divider>

                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary disabled><Icon name='facebook'></Icon>Facebook</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doTwitter}><Icon name='twitter'></Icon>Twitter</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary disabled><Icon name='google'></Icon>Google</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary disabled><Icon className='metamask'></Icon>Metamask</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
}

export default Login;