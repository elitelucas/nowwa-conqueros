import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONQUER from '../Frontend/CONQUER';
import { IndexState } from './Index';

export type HomeState = {
    initialized: boolean,
    isBusy: boolean
}

export const HomeStateDefault: HomeState = {
    initialized: false,
    isBusy: false
}

export const HomeInit = (name: string): Promise<HomeState> => {
    return Promise.resolve({
        initialized: true,
        isBusy: false
    });
};

const Home = (state: HomeState, setState: React.Dispatch<React.SetStateAction<HomeState>>, indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void) => {

    if (!state.initialized) {
        HomeInit(indexState.account!.name).then(setState);
    }

    let onLoad = () => {
        console.log('done!');
    };

    let doLogout = async () => {
        if (CONQUER.Ready) {
            await CONQUER.AUTH.logout();
            setIndexState({
                account: undefined,
                display: 'Login'
            });
        }
    };

    return (
        <>
            <Segment>
                Welcome, {indexState.account!.name}! Friends: {indexState.account?.friend_count}
                <Button fluid primary onClick={doLogout}><Icon name='log out'></Icon>Logout</Button>
            </Segment>
            <iframe
                src='https://dev.nowwa.io'
                style={{
                    border: '0px',
                    width: '100%',
                    height: '800px'
                }}
                onLoad={onLoad}></iframe>
        </>
    );
}

export default Home;