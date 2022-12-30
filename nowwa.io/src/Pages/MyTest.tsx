import React, { useState, useEffect } from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import { IndexState, } from './Index';
import { Hash, UpdateComponentState } from './Utils/Helpers';
import CONQUER from '../Frontend/CONQUER';
import Storage from '../Frontend/UTILS/Storage';
import { set } from 'mongoose';


const MyTest = (indexState: IndexState) => {
    const [data1, setData1] = useState('');
    const [data2, setData2] = useState('');

    const wallet_gethistory = async () => {
        console.log('wallet_gethistory is called')

        let res = await indexState.conquer!.Wallets.get();
        if (res.success) {
            console.log('success', res.data)
        } else {
            console.log('failed', res.message)
            return;
        }
        let walletInstance = res.data
        let history = await walletInstance.History.get();
        console.log(history)
    }

    const wallets_send = async () => {
        console.log('wallets_send is called')
        let res = await indexState.conquer!.Wallets.get();
        if (res.success) {
            console.log(res.data)
        } else {
            console.log(res.message)
            return;
        }
        let walletInstance = res.data

        res = await walletInstance.send(
            "0x6f870Ba028DC73ecAE917ABF928F75382b07C39e1",
            2
        );
        if (res.success) {
            console.log('success', res.data)
        } else {
            console.log('failed', res.message)
            return;
        }
    }

    const getAccount = async () => {
        console.log(indexState.conquer?.Storage.account.username)
    }

    const test = async () => {
        console.log('test is called')
        let conquer1 = new CONQUER("user001");
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
                            <Header textAlign='center'>My Test</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Username
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
                            Wallet
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
                            <Button fluid primary onClick={wallet_gethistory}>wallet_gethistory</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={wallets_send}>wallets_send</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary >Do Sth</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary >Do Sth</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={getAccount} >getAccount</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={test}>test</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Form>
        </Segment>
    );
}

export default MyTest;