import { stat } from "fs";
import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, CardGroup, Input, Select, Dropdown, DropdownItemProps, Accordion, LabelProps, Form, Grid, ButtonGroup, Divider } from 'semantic-ui-react';
import { statusFullUrl, toyFullUrl } from "../Core/Environment";
import Main from "../Core/Main";

export type GameConfig = {
    Thumbnail   : string,
    AppName     : string
}

type ContentIndexType = `None` | `Info` | `Build`;

export type GameState = {
    initialized : boolean,   
    configs     : GameConfig[],
    current     : {
        AppName         : string,
        ContentIndex    : ContentIndexType
    },
}

export const GameStateDefault:GameState = {
    initialized : false,
    configs     : [],
    current     : {
        AppName         : ``,
        ContentIndex    : `None`
    },
}

export const GameLoad = (state:GameState):Promise<GameState> => {
    return new Promise((resolve, reject) => {
        console.log(`get games`);
        fetch (`${toyFullUrl}`)
            .then(res => res.json())
            .then((res:GameState) => {
                let gameState:GameState = {
                    configs     : res.configs,
                    current     : state.current,
                    initialized : true,
                };
                console.log(`game:  ${JSON.stringify(gameState)}`);
                resolve(gameState);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
                reject();
            });
    }); 
};

export const GameStatus = ():Promise<boolean> => {
    return new Promise((resolve, reject) => {
        console.log(`get status`);
        fetch (`${statusFullUrl}`)
            .then(res => res.json())
            .then((res:Main.Status) => {
                resolve(res.isPlayCanvasBusy);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
                reject();
            });
    }); 
};

const Game = (state:GameState, setState:React.Dispatch<React.SetStateAction<GameState>>, busy:boolean, setBusy:React.Dispatch<React.SetStateAction<boolean>>) => {

    if (!state.initialized) {
        let gameState:GameState = {
            configs     : state.configs,
            current     : state.current,
            initialized : state.initialized,
        };
        GameLoad(gameState).then(setState);

        setInterval(() => {
            console.log(`update status`);
            GameStatus().then(setBusy);
        }, 1000);
    }

    console.log(`state.current.AppName: ${state.current.AppName}`);
    console.log(`state.current.ContentIndex: ${state.current.ContentIndex}`);

    const SelectContent = (config:GameConfig, contentIndex:ContentIndexType) => {
        let gameState:GameState = {
            configs     : state.configs,
            current     : state.current,
            initialized : state.initialized,
        };
        if (state.current.AppName == config.AppName && state.current.ContentIndex == contentIndex) {
            gameState.current.AppName = ``;
            gameState.current.ContentIndex = "None";
        } else {
            gameState.current.AppName = config.AppName;
            gameState.current.ContentIndex = contentIndex;
        }
        console.log(`select: ${gameState.current.AppName} | ${gameState.current.ContentIndex}`);
        setState(gameState);
    };

    const EntryGame = (config:GameConfig) => {

        let dropdownPlatform:DropdownItemProps[] = [
            { text: "Web", value: 0 },
            { text: "Facebook", value: 1 },
            { text: "Snapchat (Development Only)", value: 2 }
        ];

        let dropdownBackend:DropdownItemProps[] = [
            { text: "Cookies", value: 0 },
            { text: "Replicant", value: 1 },
            { text: "Nakama", value: 2 }
        ];

        let dropdownDebug:DropdownItemProps[] = [
            { text: "None", value: 0 },
            { text: "VConsole", value: 1 }
        ];
        
        return (
            <Card>
                <Card.Header>
                    <Label attached="top" size="large">{config.AppName}</Label>
                    <Image src={config.Thumbnail} fluid />
                    <Button fluid primary disabled>Web build not available</Button>
                </Card.Header>
                <Card.Content>
                    <Accordion>

                        <Accordion.Title
                            active={state.current.AppName === config.AppName && state.current.ContentIndex === `Info`}
                            onClick={() => SelectContent(config, `Info`)}
                        >
                            <Icon name='dropdown' />
                            Info
                        </Accordion.Title>
                        <Accordion.Content
                            active={state.current.AppName === config.AppName && state.current.ContentIndex === `Info`}
                        >
                            Facebook App ID
                            <Input fluid placeholder="app id"/>
                            Snapchat App ID
                            <Input fluid placeholder="app id"/>
                            <Divider hidden/>
                            <Button fluid>Update</Button>
                        </Accordion.Content>
                        
                        <Accordion.Title
                            active={state.current.AppName === config.AppName && state.current.ContentIndex === `Build`}
                            onClick={() => SelectContent(config, `Build`)}
                        >
                            <Icon name='dropdown' />
                            Build
                        </Accordion.Title>
                        <Accordion.Content
                            active={state.current.AppName === config.AppName && state.current.ContentIndex === `Build`}
                        >
                            Platform
                            <Dropdown
                                placeholder='Platform'
                                fluid
                                selection
                                options={dropdownPlatform}
                            />
                            Backend
                            <Dropdown
                                placeholder='Backend'
                                fluid
                                selection
                                options={dropdownBackend}
                            />
                            Debug
                            <Dropdown
                                placeholder='Debug'
                                fluid
                                selection
                                options={dropdownDebug}
                            />
                            <Divider hidden/>
                            <Button fluid>Build</Button>
                        </Accordion.Content>

                    </Accordion>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SegmentGroup>
            <Segment>
                PlayCanvas Status: {busy ? "Busy" : "Free"}
            </Segment>
            <Segment>
                <CardGroup>
                    {state.configs.map(EntryGame)}
                </CardGroup>
            </Segment>
        </SegmentGroup>
    );
};

export default Game;