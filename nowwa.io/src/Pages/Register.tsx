import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Form, Message } from 'semantic-ui-react';
import { authenticationRegisterUrl } from '../Core/Environment';
import { IndexProps } from './Index';

export type RegisterState = {
    initialized: boolean,
    email: string,
    password: string,
    repassword: string,
}

export const RegisterStateDefault: RegisterState = {
    initialized: false,
    email: '',
    password: '',
    repassword: '',
}

export const RegisterLoad = (state: RegisterState): Promise<RegisterState> => {
    return new Promise((resolve, reject) => {
        let registerState: RegisterState = {
            initialized: true,
            email: '',
            password: '',
            repassword: '',
        };
        resolve(registerState);
    });
};

const Register = (state: RegisterState, setState: React.Dispatch<React.SetStateAction<RegisterState>>, props: IndexProps) => {

    if (!state.initialized) {
        RegisterLoad(state).then(setState);
    }

    let setEmailValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        // console.log(`update email: ${data.value}`);
        setState({
            initialized: state.initialized,
            email: data.value,
            password: state.password,
            repassword: state.repassword
        });
    };

    let setPasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        // console.log(`update password: ${data.value}`);
        setState({
            initialized: state.initialized,
            email: state.email,
            password: data.value,
            repassword: state.repassword
        });
    };

    let setRePasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        // console.log(`update repassword: ${data.value}`);
        setState({
            initialized: state.initialized,
            email: state.email,
            password: state.password,
            repassword: data.value
        });
    };

    let goToLogin = () => {
        props.SetDisplay('Login');
    };

    let doRegister = () => {
        let url: URL = new URL(`${window.location.origin}${authenticationRegisterUrl}`);
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
                // console.log(`register response: ${JSON.stringify(res)}`);
                if (res.success) {
                    goToLogin();
                } else {

                }
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
            });
    };

    let isError: boolean = true;

    return (
        <Segment placeholder>
            <Form warning>
                <Grid centered>
                    <Grid.Row columns='8'>
                        <Grid.Column width='4'>
                            <Header textAlign='center'>Register</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='8'>
                        <Grid.Column verticalAlign='middle'>
                            Email
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Input
                                type='email'
                                fluid
                                placeholder='email'
                                onChange={setEmailValue}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='8'>
                        <Grid.Column verticalAlign='middle'>
                            Password
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Input
                                type='password'
                                fluid
                                placeholder='password'
                                onChange={setPasswordValue}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='8'>
                        <Grid.Column verticalAlign='middle'>
                            Re-type Password
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Input
                                type='password'
                                fluid
                                placeholder='password'
                                onChange={setRePasswordValue}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='10'>
                        <Grid.Column width='10'>
                            <Message
                                warning
                                header='Could you check something!'
                                list={[
                                    'That e-mail has been subscribed, but you have not yet clicked the verification link in your e-mail.',
                                ]}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='8'>
                        <Grid.Column width={4}>
                            <Button fluid primary onClick={doRegister}><Icon name='signup'></Icon>Register</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Or</Divider>

                <Grid centered columns={8}>
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
                    <Grid.Column>
                        <Button fluid primary onClick={goToLogin}><Icon name='sign in'></Icon>Login</Button>
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment >
    );
}

export default Register;