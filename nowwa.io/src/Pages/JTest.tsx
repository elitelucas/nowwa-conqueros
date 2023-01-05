import React, { useState, useEffect } from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { IndexState, } from './Index';
import { Hash, UpdateComponentState } from './Utils/Helpers';
import CONQUER from '../Frontend/CONQUER';
import Storage from '../Frontend/UTILS/Storage';
import { set } from 'mongoose';


const JTest = (indexState: IndexState) => {
    const [data1, setData1] = useState('0x09904C9C9b77fBc2a1C2a14c050d48975129Cc43');
    const [data2, setData2] = useState(1.3);

    const wallet_gethistory = async () => {
        console.log('wallet_gethistory is called')

        let res = await indexState.conquer!.Wallets.get();

        if (res.success) {
            let walletInstance = res.data
            let history = await walletInstance.History.get();
            console.log(history)
        } else {
            alert(res.message)
            return;
        }
    }

    const wallets_send = async () => {
        console.log('wallets_send is called')
        let res = await indexState.conquer!.Wallets.get();
        if (res.success) {
            let walletInstance = res.data

            res = await walletInstance.send(
                data1,
                data2
            );
            if (res.success) {
                console.log('success', res.data)
            } else {
                alert(res.message)
                return;
            }
        } else {
            alert(res.message)
            return;
        }

    }

    const getAccount = async () => {
        console.log(indexState.conquer?.User!.username)
    }

    const games_getone = async () => {
        console.log('test is called')
        let conquer1 = new CONQUER({ username: "user001" });
        await conquer1.init();
        let gameInstance = await conquer1.Games.getOne("Bowling");

        console.log("GAME INSTANCE", gameInstance)

        return;
    }

    return (
        <Segment placeholder>

            <Form >
                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Header textAlign='center'>J's Test(Jan 6)</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Recepient Address
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='text'
                                value={data1}
                                onChange={(e) => setData1(e.target.value)}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Amount
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='text'
                                value={data2}
                                onChange={(e) => setData2(e.target.value)}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center' width='8'>
                            <Message
                                warning

                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={wallet_gethistory}>wallet.History.get</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={wallets_send}>wallet.send</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary disabled>Do Sth</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary disabled>Do Sth</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={getAccount} >User.username</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={games_getone}>Games.getOne</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Form>
        </Segment>
    );
}

export default JTest;