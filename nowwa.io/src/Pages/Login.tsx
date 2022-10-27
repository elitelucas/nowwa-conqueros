import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image } from 'semantic-ui-react';
import { authenticationLoginUrl, authenticationRegisterUrl } from '../Core/Environment';
import { IndexProps } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';

export type LoginState = {
    initialized: boolean,
    email: string,
    password: string,
}

export const LoginStateDefault: LoginState = {
    initialized: false,
    email: '',
    password: '',
}

export const LoginInit = (state: LoginState): Promise<LoginState> => {
    return new Promise((resolve, reject) => {
        let loginState: LoginState = {
            initialized: true,
            email: '',
            password: '',
        };
        resolve(loginState);
    });
};

const Login = (state: LoginState, setState: React.Dispatch<React.SetStateAction<LoginState>>, props: IndexProps) => {

    if (!state.initialized) {
        LoginInit(state).then(setState);
    }

    let setEmailValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        console.log(`update email: ${data.value}`);
        setState({
            initialized: state.initialized,
            email: data.value,
            password: state.password
        });
    };

    let setPasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        console.log(`update password: ${data.value}`);
        setState({
            initialized: state.initialized,
            email: state.email,
            password: data.value
        });
    };

    let goToRegister = () => {
        props.SetDisplay('Register');
    };

    let doLogin = () => {
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
                console.log(`login response: ${JSON.stringify(res)}`);
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
            });
    };

    return (
        <Segment placeholder>
            <Grid centered columns='8'>
                <Grid.Row>
                    <Grid.Column width='4'>
                        <Header textAlign='center'>Login</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column verticalAlign='middle'>
                        Email
                    </Grid.Column>
                    <Grid.Column>
                        <Input
                            fluid
                            placeholder='email'
                            onChange={setEmailValue}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column verticalAlign='middle'>
                        Password
                    </Grid.Column>
                    <Grid.Column>
                        <Input
                            type='password'
                            fluid
                            placeholder='password'
                            onChange={setPasswordValue}
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
                    <Button fluid primary><Icon className='metamask'></Icon>Metamask</Button>
                </Grid.Column>
            </Grid>
        </Segment>
    );
}

export default Login;