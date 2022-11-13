import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONFIG, { authenticationLoginUrl, discordAuthUrl, googleAuthUrl, snapchatCallbackUrl, socialAuthLinks as socialAuthLinks, twitterAuthUrl } from '../Core/CONFIG/CONFIG';
import { IndexState, } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';
import { Hash, UpdateComponentState } from './Utils/Helpers';
import './Utils/Facebook';

export type LoginState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    warning: string,
    twitter: string,
    discord: string,
    google: string,
    snapchat: string,
    facebookReady: boolean,
}

export const LoginStateDefault: LoginState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    warning: '',
    twitter: '',
    discord: '',
    google: '',
    snapchat: '',
    facebookReady: false,
}

export const LoginInit = async (state: LoginState): Promise<LoginState> => {
    try {
        let socialAuthLinkResponse = await new Promise<any>((resolve, reject) => {
            let socialAuthLinksUrl: URL = new URL(`${window.location.origin}${socialAuthLinks}`);
            let socialAuthLinksRequest: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: '{}'
            };
            fetch(socialAuthLinksUrl, socialAuthLinksRequest)
                .then(socialAuthLinkResponse => socialAuthLinkResponse.json())
                .then((socialAuthLinkResponse: any) => {
                    resolve(socialAuthLinkResponse);
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                    reject(error);
                });

        });

        await new Promise<void>((resolve, reject) => {

            let facebookScript = document.createElement('script');
            facebookScript.type = 'text/javascript';
            facebookScript.src = 'https://connect.facebook.net/en_US/sdk.js';
            facebookScript.async = true;
            facebookScript.defer = true;

            facebookScript.onload = () => {

                console.log('facebook loaded');

                let facebookAppId: string = `2303120786519319`;
                FB.init({
                    appId: facebookAppId,
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v15.0'
                });

                FB.AppEvents.logPageView();
                resolve();
            }
            document.body.appendChild(facebookScript);
        });

        return Promise.resolve({
            email: state.email,
            initialized: true,
            isBusy: false,
            password: '',
            warning: '',
            twitter: socialAuthLinkResponse.twitter,
            discord: socialAuthLinkResponse.discord,
            google: socialAuthLinkResponse.google,
            snapchat: socialAuthLinkResponse.snapchat,
            facebookReady: true
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
        window.open(state.twitter, "_self");
    };

    let doGoogle = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.google, "_self");
    };

    let doFacebook = async () => {
        try {

            let originalUrl: string = window.location.origin;
            let loginStatus = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.getLoginStatus((loginStatus) => {
                    // console.log(`loginStatus`, JSON.stringify(loginStatus, null, 4));
                    // statusChangeCallback(response);
                    resolve(loginStatus);
                });
            });

            if (!loginStatus.authResponse) {
                // no user is logged in
            } else {

                // no user is logged in
            }

            let authResponse = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.login((authResponse) => {
                    resolve(authResponse);
                }, { scope: 'public_profile,email,user_friends' });
            });

            let fields: string[] = [
                'name',
                'email',
            ];

            let apiResponse1 = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.api('/me', { fields: fields.join(', ') }, (apiResponse1: any) => {
                    resolve(apiResponse1);
                });
            });

            let apiResponse2 = await new Promise<fb.StatusResponse>((resolve, reject) => {
                FB.api('/me/friends', {}, (apiResponse2: any) => {
                    resolve(apiResponse2);
                });
            });

            let userInfo = apiResponse1 as any;
            let contactInfo = apiResponse2 as any;
            let token = await Hash(userInfo.email as string);

            let redirectURL: string = `${originalUrl}/Index.html?info=loggedin&name=${userInfo.name}&token=${token}&admin=false&id=${userInfo.email}&friend_count=${contactInfo.summary.total_count}`;
            window.location.href = redirectURL;

        } catch (error) {

        }
    };

    let doDiscord = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.discord, "_self");
    };

    let doSnapchat = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.snapchat, "_self");
    };

    let doMetamask = async () => {
        let originalUrl: string = window.location.origin;
        let ethereum = (window as any).ethereum;
        if (!ethereum) {
            alert('install metamask wallet first!');
        } else {
            updateState({
                isBusy: true,
                warning: ''
            });
            (window as any).ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then((accounts: string[]) => {
                    let email = accounts[0];
                    Hash(email as string)
                        .then((token) => {
                            let redirectURL: string = `${originalUrl}/Index.html?info=loggedin&name=${email}&token=${token}&admin=false&id=${email}`;
                            window.location.href = redirectURL;
                        })
                        .catch((error) => {
                            updateState({
                                isBusy: false,
                                warning: error.message
                            });
                        });
                })
                .catch((error: any) => {
                    updateState({
                        isBusy: false,
                        warning: error.message
                    });
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