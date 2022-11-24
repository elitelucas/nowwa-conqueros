import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { IndexState, } from './Index';
import { Hash, UpdateComponentState } from './Utils/Helpers';
import './Utils/Facebook';
import CONQUER from '../Frontend/CONQUER';

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
            if (CONQUER.Ready) {
                updateState({
                    isBusy: true,
                    warning: '',
                });
                let res = await CONQUER.AUTH.username({
                    username: state.email,
                    password: state.password
                });
                
                if (res.success) {
                    setIndexState({
                        display: 'Home',
                        account: {
                            admin: res.result.admin,
                            friend_count: res.result.friend_count,
                            id: res.result.uID,
                            name: res.result.firstName,
                            token: res.result.token
                        }
                    });
                } else {
                    updateState({
                        isBusy: false,
                        warning: res.error,
                    });
                }
                console.log(`result`, res);
            }
        }
    }

    let doTwitter = async () => {
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.twitter();
        }
    };

    let doGoogle = async () => {
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.google();
        }
    };

    let doFacebook = async () => {
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.facebook()
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
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.discord();
        }
    };

    let doSnapchat = async () => {
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.snapchat();
        }
    };

    let doMetamask = async () => {
        if (CONQUER.Ready) {
            CONQUER.SOCIALAUTH.metamask()
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
                            <Button fluid primary onClick={doFacebook}><Icon name='facebook'></Icon>Facebook</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doTwitter}><Icon name='twitter'></Icon>Twitter</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doGoogle}><Icon name='google'></Icon>Google</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doDiscord}><Icon name='discord'></Icon>Discord</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doSnapchat}><Icon name='snapchat'></Icon>Snapchat</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doMetamask}><Icon className='metamask'></Icon>Metamask</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
}

export default Login;