import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Form, Message } from 'semantic-ui-react';
import { authenticationRegisterUrl } from '../Core/CONFIG/Environment';
import { IndexProps, IndexState } from './Index';
import { UpdateComponentState } from './Utils';

export type RegisterState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    repassword: string,
    warning: string,
    shouldReset: boolean
}

export const RegisterStateDefault: RegisterState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    repassword: '',
    warning: '',
    shouldReset: false
}

export const RegisterLoad = (state: RegisterState): Promise<RegisterState> => {
    return new Promise((resolve, reject) => {
        let registerState: RegisterState = {
            isBusy: false,
            initialized: true,
            email: '',
            password: '',
            repassword: '',
            warning: '',
            shouldReset: false
        };
        resolve(registerState);
    });
};

const Register = (state: RegisterState, setState: React.Dispatch<React.SetStateAction<RegisterState>>, indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void) => {

    if (!state.initialized) {
        RegisterLoad(state).then(setState);
    }

    let updateState = (updates: Partial<RegisterState>) => {
        let newState = UpdateComponentState<RegisterState>(state, updates);
        setState(newState);
    };

    let setEmail = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            shouldReset: false,
            email: data.value
        });
    };

    let setPassword = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            shouldReset: false,
            password: data.value
        });
    };

    let setRePassword = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            shouldReset: false,
            repassword: data.value
        });
    };
    let goToLogin = () => {
        setState(RegisterStateDefault);
        setIndexState({
            display: 'Login'
        });
    };

    let doRegister = () => {
        if (state.email.length == 0) {
            updateState({ warning: `email cannot be empty` });
        } else if (state.password.length == 0) {
            updateState({ warning: `password cannot be empty` });
        } else if (state.password != state.repassword) {
            updateState({ warning: `password mismatch` });
        } else {
            updateState({
                isBusy: true,
                shouldReset: true,
                warning: ''
            });
            let url: URL = new URL(`${window.location.origin}${authenticationRegisterUrl}`);
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
                    console.log(`register response: ${JSON.stringify(res)}`);
                    if (res.success) {
                        updateState({
                            isBusy: false,
                            shouldReset: true,
                            warning: `check your email to verify your account`
                        });
                    } else {
                        updateState({
                            isBusy: false,
                            shouldReset: true,
                            warning: res.error
                        });
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
                            <Header textAlign='center'>Register</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Email
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                value={state.shouldReset ? '' : state.email}
                                type='email'
                                placeholder='email'
                                onChange={setEmail}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Password
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                value={state.shouldReset ? '' : state.password}
                                type='password'
                                placeholder='password'
                                onChange={setPassword}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Re-type Password
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                value={state.shouldReset ? '' : state.repassword}
                                type='password'
                                placeholder='password'
                                onChange={setRePassword}
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
                    <Grid.Row >
                        <Grid.Column>
                            <Button fluid primary onClick={doRegister} disabled={state.isBusy}><Icon name='signup'></Icon>Register</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Or</Divider>

                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={goToLogin}><Icon name='sign in'></Icon>Login</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment >
    );
}

export default Register;