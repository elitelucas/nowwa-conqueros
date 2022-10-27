import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Form, Message } from 'semantic-ui-react';
import { authenticationRegisterUrl } from '../Core/Environment';
import { IndexProps } from './Index';

export type RegisterState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    repassword: string,
    warning: string
}

export const RegisterStateDefault: RegisterState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    repassword: '',
    warning: '',
}

export const RegisterLoad = (state: RegisterState): Promise<RegisterState> => {
    return new Promise((resolve, reject) => {
        let registerState: RegisterState = {
            isBusy: false,
            initialized: true,
            email: '',
            password: '',
            repassword: '',
            warning: ''
        };
        resolve(registerState);
    });
};

const Register = (state: RegisterState, setState: React.Dispatch<React.SetStateAction<RegisterState>>, indexProps: IndexProps) => {

    if (!state.initialized) {
        RegisterLoad(state).then(setState);
    }

    let setEmailValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: data.value,
            password: state.password,
            repassword: state.repassword,
            warning: state.warning
        });
    };

    let setPasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: state.email,
            password: data.value,
            repassword: state.repassword,
            warning: state.warning,
        });
    };

    let setRePasswordValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: state.email,
            password: state.password,
            repassword: data.value,
            warning: state.warning,
        });
    };

    let setWarningValue = (warning: string) => {
        setState({
            initialized: state.initialized,
            isBusy: state.isBusy,
            email: state.email,
            password: state.password,
            repassword: state.repassword,
            warning: warning,
        });
    };

    let setIsBusy = (isBusy: boolean) => {
        setState({
            initialized: state.initialized,
            isBusy: isBusy,
            email: state.email,
            password: state.password,
            repassword: state.repassword,
            warning: state.warning,
        });
    };

    let goToLogin = () => {
        setState(RegisterStateDefault);
        indexProps.SetDisplay('Login');
    };

    let doRegister = () => {
        if (state.email.length == 0) {
            setWarningValue('email cannot be empty!');
        } else if (state.password.length == 0) {
            setWarningValue('password cannot be empty!');
        } else if (state.password != state.repassword) {
            setWarningValue('password mismatch!');
        } else {
            setWarningValue('');
            setIsBusy(true);
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
                            <Header textAlign='center'>Register</Header>
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
                    <Grid.Row >
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
                    <Grid.Row >
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Re-type Password
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='password'
                                placeholder='password'
                                onChange={setRePasswordValue}
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