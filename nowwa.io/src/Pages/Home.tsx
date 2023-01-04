import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONQUER from '../Frontend/CONQUER';
import { IndexState } from './Index';
import { UpdateComponentState } from './Utils/Helpers';

export type HomeState = {
    initialized: boolean,
    isBusy: boolean
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

    return (
        <>
            <Segment>
                <Grid columns='equal' verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column>
                            Welcome, {indexState.conquer!.User!.firstName!}!
                        </Grid.Column>
                        <Grid.Column width='2'>
                            <Button fluid primary onClick={doLogout} disabled={state.isBusy}><Icon name='log out'></Icon>Logout</Button>
                            <Button fluid primary onClick={doShareTwitter} disabled={state.isBusy}><Icon name='share'></Icon>Twitter</Button>
                            <Button fluid primary onClick={doShareFacebook} disabled={state.isBusy}><Icon name='share'></Icon>Facebook</Button>
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