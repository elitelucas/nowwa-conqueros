import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { IndexState, } from './Index';
import { Hash, UpdateComponentState } from './Utils/Helpers';
import './Utils/Facebook';
import CONQUER from '../Frontend/CONQUER';
import Storage from '../Frontend/UTILS/Storage';

export type LoginState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    warning: string,
}

export const LoginStateDefault: LoginState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    warning: '',
}

export const LoginInit = async (state: LoginState): Promise<LoginState> => {
    try {
        return Promise.resolve({
            email: state.email,
            initialized: true,
            isBusy: false,
            password: '',
            warning: ''
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

const Login = (state: LoginState, setState: React.Dispatch<React.SetStateAction<LoginState>>, indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void) => {

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

    let doLogin = async () => {
        if (state.email.length == 0) {
            setWarning('email cannot be empty!');
        } else if (state.password.length == 0) {
            setWarning('password cannot be empty!');
        } else {
            if (CONQUER.initialized) {
                updateState({
                    isBusy: true,
                    warning: '',
                });
                let res = await CONQUER.Auth.get({
                    username: state.email,
                    password: state.password
                });
                
                if (res.success) 
                {
                    window.location.reload();
                } else {
                    updateState({
                        isBusy: false,
                        warning: res.result,
                    });
                }
            }
        }
    }

    let doGuest = async () => {
        if (CONQUER.initialized) {
            setIndexState({
                display: 'Home',
                acceptGuest: true,
                account: CONQUER.User!
            });
        }
    }

    let doTwitter = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.twitter();
        }
    };

    let doGoogle = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.google();
        }
    };

    let doFacebook = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.facebook()
                .then((res) => {
                    if (res.success) {
                        setIndexState({
                            display: 'Home',
                            account: res.account
                        });
                    } else {
                        updateState({
                            isBusy: false,
                            warning: res.error,
                        });
                    }
                });
        }
    };

    let doDiscord = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.discord();
        }
    };

    let doSnapchat = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.snapchat();
        }
    };

    let doMetamask = async () => {
        if (CONQUER.initialized) {
            CONQUER.WebAuth.metamask()
                .then((res) => {
                    console.log(res);
                    if (res.success) {
                        setIndexState({
                            display: 'Home',
                            account: res.account
                        });
                    } else {
                        updateState({
                            isBusy: false,
                            warning: res.error,
                        });
                    }
                });
        }
    };

    return (
        <Segment placeholder>

            <Form warning={typeof state.warning != 'undefined' && state.warning.length > 0}>
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
                            <Button fluid primary onClick={doLogin} disabled={state.isBusy || indexState.isBusy}><Icon name='sign in'></Icon>Login</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={goToRegister} disabled={state.isBusy || indexState.isBusy}><Icon name='signup'></Icon>Register</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doGuest} disabled={state.isBusy || indexState.isBusy}><Icon name='user'></Icon>Guest</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Or</Divider>

                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={doFacebook} disabled={state.isBusy || indexState.isBusy}><Icon name='facebook'></Icon>Facebook</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doTwitter} disabled={state.isBusy || indexState.isBusy}><Icon name='twitter'></Icon>Twitter</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doGoogle} disabled={state.isBusy || indexState.isBusy}><Icon name='google'></Icon>Google</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doDiscord} disabled={state.isBusy || indexState.isBusy}><Icon name='discord'></Icon>Discord</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doSnapchat} disabled={state.isBusy || indexState.isBusy}><Icon name='snapchat'></Icon>Snapchat</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doMetamask} disabled={state.isBusy || indexState.isBusy}><Icon className='metamask'></Icon>Metamask</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
}

export default Login;