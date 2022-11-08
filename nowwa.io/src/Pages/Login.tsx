import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import Environment, { authenticationLoginUrl, discordCallbackUrl, snapchatCallbackUrl, twitterAuthUrl } from '../Core/CONFIG/Environment';
import { IndexState, } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';
import { Hash, UpdateComponentState } from './Utils';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { update } from 'node-7z';

export type LoginState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    warning: string,
    twitter: string,
    discord: string,
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
    facebookReady: false,
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

                    let facebookScript = document.createElement('script');
                    facebookScript.type = 'text/javascript';
                    facebookScript.src = 'https://connect.facebook.net/en_US/sdk.js';
                    facebookScript.async = true;
                    facebookScript.defer = true;
                    facebookScript.onload = () => {

                        let discordClientId: string = `1037020376892452864`;
                        let discordRedirect: string = encodeURIComponent(`${Environment.PublicUrl}${discordCallbackUrl}`);
                        let discordScope: string = encodeURIComponent(`identify email`);
                        let discordResponseType: string = `code`;
                        let discordUrl: string = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${discordRedirect}&response_type=${discordResponseType}&scope=${discordScope}`;

                        let facebookAppId: string = `642034654138108`;
                        (window as any).FB.init({
                            appId: facebookAppId,
                            autoLogAppEvents: true,
                            xfbml: true,
                            version: 'v15.0'
                        });

                        resolve({
                            email: state.email,
                            initialized: true,
                            isBusy: false,
                            password: '',
                            warning: '',
                            twitter: res.link,
                            discord: discordUrl,
                            facebookReady: true
                        });
                    };
                    document.body.appendChild(facebookScript);
                }
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
                reject(error);
            });
    });
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
        const firebaseOptions: FirebaseOptions = {
            apiKey: "AIzaSyAdI0h9Bwrfk4VqC3-MDdfCvkECETnpml0",
            authDomain: "nowwaio.firebaseapp.com",
        };
        const app: FirebaseApp = initializeApp(firebaseOptions, "nowwa.io");
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        try {
            let resolver = await signInWithPopup(auth, provider);
            Hash(resolver.user.email as string)
                .then((token) => {
                    let redirectURL: string = `${Environment.PublicUrl}/Index.html?info=loggedin&name=${resolver.user.displayName}&token=${token}&admin=false&id=${resolver.user.email}`;
                    window.location.href = redirectURL;
                });
        }
        catch (error) {
            updateState({
                isBusy: false,
                warning: error.message
            });
        }
    };

    let doFacebook = async () => {
        let FB = (window as any).FB as any;
        FB.login((loginResponse) => {
            // handle the response 
            FB.api('/me', { fields: 'name, email, user_friends' }, (apiResponse) => {
                // console.log(`apiResponse`, JSON.stringify(apiResponse, null, 4));
                // FB.api(`/${apiResponse.id}/friends`, {}, (response) => {
                //     console.log(`response`, JSON.stringify(response, null, 4));
                // });
                Hash(apiResponse.email as string)
                    .then((token) => {
                        let redirectURL: string = `${Environment.PublicUrl}/Index.html?info=loggedin&name=${apiResponse.name}&token=${token}&admin=false&id=${apiResponse.email}`;
                        window.location.href = redirectURL;
                    });
            });
        }, { scope: 'public_profile,email' });
    };

    let doDiscord = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.discord, "_self");
    };

    let doMetamask = async () => {
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
                            let redirectURL: string = `${Environment.PublicUrl}/Index.html?info=loggedin&name=${email}&token=${token}&admin=false&id=${email}`;
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

    let doSnapchat = async () => {

        let snapchatClientId: string = `e6a503b3-6929-4feb-a6d9-b1dc0bd963ed`;
        let snapchatClientSecret: string = `e6a503b3-6929-4feb-a6d9-b1dc0bd963ed`;
        let snapchatRedirect: string = encodeURIComponent(`${Environment.PublicUrl}${snapchatCallbackUrl}`);
        let snapchatState: string = `g0qVDoSOERd-6ClRJoCoZOI-nHrpln8XKXYwLJoXbg8`;
        let snapchatScopeList: string[] = [
            "https://auth.snapchat.com/oauth2/api/user.display_name",
            "https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar",
            "https://auth.snapchat.com/oauth2/api/user.external_id",
        ];
        let snapchatScope: string = encodeURIComponent(snapchatScopeList.join(' '));
        let snapchatResponseType: string = `code`;
        let snapchatUrl: string = `https://accounts.snapchat.com/accounts/oauth2/auth?client_id=${snapchatClientId}&redirect_uri=${snapchatRedirect}&response_type=${snapchatResponseType}&scope=${snapchatScope}&state=${snapchatState}`;

        window.open(snapchatUrl, "_self");
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