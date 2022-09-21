import { equal } from 'assert';
import React, { useState, useEffect } from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, Embed, ButtonGroup, Divider, Grid, TextArea, Form } from 'semantic-ui-react';
import Conquer from '../Core/Conquer';

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

export const NakamaConnect = (username: string, password: string): Promise<any> => {
    return Conquer.NakamaConnect(username, password);
};

const Test = (state: TestState, setState: React.Dispatch<React.SetStateAction<TestState>>) => {

    if (!state.initialized) {
        TestLoad(state).then(setState);
        var password = "password002";
        var username = "username002";
        // Conquer.NakamaConnect(username, password).then((session) => {
        //     console.log(session);
        //     var params2 = {
        //         game_id: "game001",
        //         // context_id: "context001",
        //         username: "username002",
        //         key: "key002"
        //     };
        //     Conquer.NakamaRPC("get_data", params2).then((rpcResponse) => {
        //         console.log(rpcResponse);
        //     });
        // });
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