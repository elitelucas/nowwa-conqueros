import React, { useEffect, useState } from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONQUER from '../Frontend/CONQUER';
import { IndexState } from './Index';
import { UpdateComponentState } from './Utils/Helpers';

export type HomeState = {
    initialized: boolean,
    isBusy: boolean,
    firstEmail?:string,
    firstGuild?:{
        id:string,
        name:string,
    },
}

export const HomeStateDefault: HomeState = {
    initialized: false,
    isBusy: false
}

export const HomeInit = (): Promise<HomeState> => {
    return Promise.resolve({
        initialized: true,
        isBusy: false
    });
};

const Home = (state: HomeState, setState: React.Dispatch<React.SetStateAction<HomeState>>, indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void) => {

    if (!state.initialized) {
        HomeInit().then(setState);
    }

    const updateState = (updates: Partial<HomeState>) => {
        let newState = UpdateComponentState<HomeState>(state, updates);
        setState(newState);
    };

    let doLogout = async () => {
        if (indexState.conquer!.initialized) {
            updateState({
                isBusy: true
            });
            await indexState.conquer!.Auth.logout();
            updateState({
                isBusy: false
            });
            setIndexState({
                display: 'Login',
                isBusy: false,
                conquer: indexState.conquer
            });
        }
    };

    let doShareTwitter = async () => {
        if (indexState.conquer!.initialized) {
            updateState({
                isBusy: true
            });
            await indexState.conquer!.WebAuth.shareTwitter();
            updateState({
                isBusy: false
            });
        }
    };

    let doShareFacebook = async () => {
        if (indexState.conquer!.initialized) {
            updateState({
                isBusy: true
            });
            await indexState.conquer!.WebAuth.shareFacebook();
            updateState({
                isBusy: false
            });
        }
    };

    let doShareDiscordGet = async () => {
        updateState({
            isBusy: true
        });
        let firstGuild:{id:string, name:string} | undefined;
        let results = await indexState.conquer!.WebAuth.shareDiscordGet();
        if (results.length > 0) {
            firstGuild = results[0];
        }
        updateState({
            isBusy: false,
            firstGuild: firstGuild
        });
    };

    let doShareDiscord = async () => {
        updateState({
            isBusy: true
        });
        await indexState.conquer!.WebAuth.shareDiscord( state.firstGuild! );
        updateState({
            isBusy: false
        });
    };

    let doShareGoogleGet = async () => {
        updateState({
            isBusy: true
        });
        let firstEmail:string | undefined;
        let results = await indexState.conquer!.WebAuth.shareGoogleGet();
        if (results.length > 0) {
            firstEmail = results[0];
        }
        updateState({
            isBusy: false,
            firstEmail: firstEmail
        });
    };

    let doShareGoogle = async () => {
        updateState({
            isBusy: true
        });
        await indexState.conquer!.WebAuth.shareGoogle( state.firstEmail! );
        updateState({
            isBusy: false
        });
    };

    let buttonGoogleShareGet = <Button width='1' fluid primary onClick={doShareGoogleGet} disabled={state.isBusy}><Icon name='download'></Icon>Google</Button>;
    let buttonGoogleShare = <Button width='1' fluid primary onClick={doShareGoogle} disabled={state.isBusy}><Icon name='share'></Icon>{state.firstEmail}</Button>;
    
    let buttonDiscordShareGet = <Button width='1' fluid primary onClick={doShareDiscordGet} disabled={state.isBusy}><Icon name='download'></Icon>Discord</Button>;
    let buttonDiscordShare = <Button width='1' fluid primary onClick={doShareDiscord} disabled={state.isBusy}><Icon name='share'></Icon>{typeof state.firstGuild != 'undefined' && state.firstGuild!.name }</Button>;
    
    return (
        <>
            <Segment>
                <Grid verticalAlign='middle'>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            Welcome, {indexState.conquer!.User!.firstName!}!
                        </Grid.Column>
                        <Grid.Column>
                            <Button.Group widths='5'>
                                <Button width='1' fluid primary onClick={doShareTwitter} disabled={state.isBusy}><Icon name='share'></Icon>Twitter</Button>
                                <Button width='1' fluid primary onClick={doShareFacebook} disabled={state.isBusy}><Icon name='share'></Icon>Facebook</Button>
                                {typeof state.firstEmail == 'undefined' && buttonGoogleShareGet}
                                {typeof state.firstEmail != 'undefined' && buttonGoogleShare}
                                {typeof state.firstGuild == 'undefined' && buttonDiscordShareGet}
                                {typeof state.firstGuild != 'undefined' && buttonDiscordShare}
                                <Button width='1' fluid primary onClick={doLogout} disabled={state.isBusy}><Icon name='log out'></Icon>Logout</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            {/* <iframe
                src='https://dev.nowwa.io'
                style={{
                    border: '0px',
                    width: '100%',
                    height: '800px'
                }}
                onLoad={onLoad}></iframe> */}
        </>
    );
}

export default Home;