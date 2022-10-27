import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { authenticationLoginUrl, authenticationRegisterUrl } from '../Core/Environment';
import { IndexProps } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';

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
    warning: ''
}

export const LoginInit = (state: LoginState): Promise<LoginState> => {
    return new Promise((resolve, reject) => {
        let loginState: LoginState = {
            initialized: true,
            isBusy: false,
            email: '',
            password: '',
            warning: '',
        };
        resolve(loginState);
    });
};

const Login = (state: LoginState, setState: React.Dispatch<React.SetStateAction<LoginState>>, indexProps: IndexProps) => {

    if (!state.initialized) {
        LoginInit(state).then(setState);
    }

    let setEmailValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: data.value,
            password: state.password,
            warning: state.warning
        });
    };

    let setPasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: state.email,
            password: data.value,
            warning: state.warning
        });
    };

    let setWarningValue = (warning: string) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: state.email,
            password: state.password,
            warning: warning,
        });
    };

    let setIsBusy = (isBusy: boolean) => {
        setState({
            initialized: state.initialized,
            isBusy: isBusy,
            email: state.email,
            password: state.password,
            warning: state.warning,
        });
    };

    let goToRegister = () => {
        setState(LoginStateDefault);
        indexProps.SetDisplay('Register');
    };

    let doLogin = () => {
        if (state.email.length == 0) {
            setWarningValue('email cannot be empty!');
        } else if (state.password.length == 0) {
            setWarningValue('password cannot be empty!');
        } else {
            setWarningValue('');
            setIsBusy(true);
            let url: URL = new URL(`${window.location.origin}${authenticationLoginUrl}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: state.email,
                    password: state.password
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`login response: ${JSON.stringify(res)}`);
                    if (res.success) {
                        if (res.value.admin) {
                            indexProps.SetDisplay('Build');
                        } else {
                            indexProps.SetDisplay('None');
                        }
                    } else {
                        setIsBusy(false);
                        setWarningValue(res.error);
                    }
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
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
                                onChange={setEmailValue}
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
                                onChange={setPasswordValue}
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
                            <Button fluid primary onClick={doLogin}><Icon name='sign in'></Icon>Login</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={goToRegister}><Icon name='signup'></Icon>Register</Button>
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
                            <Button fluid primary disabled><Icon name='twitter'></Icon>Twitter</Button>
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