import { equal } from 'assert';
import React, { useState, useEffect } from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, Embed, ButtonGroup, Divider, Grid, TextArea, Form } from 'semantic-ui-react';
import Conquer from '../Frontend/Conquer';
import { Client, RpcResponse, Session } from '@heroiclabs/nakama-js';

export type TestState = {
    initialized: boolean,
}

export const TestStateDefault: TestState = {
    initialized: false,
}

export const TestLoad = (state: TestState): Promise<TestState> => {
    return new Promise((resolve, reject) => {
        let testState: TestState = {
            initialized: true,
        };
        resolve(testState);
    });
};

const Test = (state: TestState, setState: React.Dispatch<React.SetStateAction<TestState>>) => {

    if (!state.initialized) {
        var username = "username001";
        var password = "password001";
        var gameId = "game001";
        var contextId = "context001";
        var value = { key: "value" };
        let conquer: Conquer = new Conquer();
        conquer.NakamaConnect(username, password).then(() => {
            conquer.NakamaSave(gameId, value).then(() => {
                console.log('done');
            });
        });
        console.log('done');
        // conquer.NakamaSaveContext(gameId, contextId, value).then((res1) => {
        //     console.log(`res1: ${JSON.stringify(res1)}`);
        //     conquer.NakamaLoadContext(gameId, contextId).then((res2) => {
        //         console.log(`res2: ${JSON.stringify(res2)}`);
        //     });
        // });
        // Conquer.TestNakama();  
        // let nakamaServerKey = process.env.NAKAMA_SERVER_KEY;
        // let nakamaHost = process.env.NAKAMA_HOST;
        // let nakamaPort = process.env.NAKAMA_PORT;
        // let nakamaUseSSL = process.env.NAKAMA_USE_SSL;
        // console.log(`${nakamaServerKey} | ${nakamaUseSSL} | ${nakamaHost} | ${nakamaPort}`);
        // let nakamaClient = new Client(process.env.NAKAMA_SERVER_KEY, process.env.NAKAMA_HOST, process.env.NAKAMA_PORT, process.env.NAKAMA_USE_SSL as string == "true");
        // console.log(`deployed: ${username}`)
        TestLoad(state).then(setState);
    }

    return (
        <SegmentGroup>
            <Segment>
                <Grid columns={2} stackable>
                    <Grid.Column>
                        <ButtonGroup>
                            <Button>
                                Test 1
                            </Button>
                            <Button>
                                Test 2
                            </Button>
                        </ButtonGroup>
                    </Grid.Column>

                    <Grid.Column>
                        <Grid.Row>
                            <p>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                                ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                                magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                                ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                                quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                                arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                                Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                                dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                                Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                                Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                                viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                                Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                            </p>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>

                <Divider vertical></Divider>
            </Segment>
        </SegmentGroup >
    );
};

export default Test;