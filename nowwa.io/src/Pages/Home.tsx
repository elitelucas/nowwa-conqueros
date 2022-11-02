import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';

export type HomeState = {
    initialized: boolean,
    isBusy: boolean,
    name: string,
}

export const HomeStateDefault: HomeState = {
    initialized: false,
    isBusy: false,
    name: '',
}

export const HomeInit = (name: string): Promise<HomeState> => {
    return Promise.resolve({
        initialized: true,
        isBusy: false,
        name: name
    });
};

const Home = (state: HomeState, setState: React.Dispatch<React.SetStateAction<HomeState>>, name: string) => {

    if (!state.initialized) {
        HomeInit(name).then(setState);
    }

    return (
        <>
            <Segment>
                Welcome, {state.name}!
            </Segment>
            <iframe src='https://dev.nowwa.io' style={{
                border: '0px',
                width: '100%',
                height: '800px'
            }}></iframe>
        </>
    );
}

export default Home;