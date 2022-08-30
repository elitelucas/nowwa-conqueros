import { stat } from "fs";
import React, { useState, useEffect, SyntheticEvent } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, CardGroup, Input, Select, Dropdown, DropdownItemProps, Accordion, LabelProps, Form, Grid, ButtonGroup, Divider, DropdownProps, InputOnChangeData, Loader, Dimmer, LabelDetail, Menu } from 'semantic-ui-react';
import { toyBuildCoreUrl, toyStatusCoreUrl, toyListCoreUrl, coreUrl } from "../Core/Environment";
import Game from "../Core/Game";
import Main from "../Core/Main";
import PlayCanvas from "../Core/Playcanvas";

type ContentIndexType = `None` | `Info` | `Build` | `Archive`;

type BuildValue = {
    backend:Game.Backend,
    debug:boolean,
    platform:Game.Platform,
    version:string
};

const BuildValueDefault:BuildValue = {
    backend: 'Cookies',
    debug: false,
    platform: 'Web',
    version: "0.0.0",
}

export type GameState = {
    initialized : boolean,   
    configs     : Game.Config[],
    current     : {
        AppName         : string,
        ContentIndex    : ContentIndexType
    },
    buildValues : {[config:string]:BuildValue}
}

export const GameStateDefault:GameState = {
    initialized : false,
    configs     : [],
    current     : {
        AppName         : ``,
        ContentIndex    : `None`
    },
    buildValues : {}
}

export const GameLoad = (state:GameState):Promise<GameState> => {
    return new Promise((resolve, reject) => {
        // console.log(`get games`);
        fetch (`${toyListCoreUrl}`)
            .then(res => res.json())
            .then((res:GameState) => {
                let gameState:GameState = {
                    configs     : res.configs,
                    current     : state.current,
                    initialized : true,
                    buildValues : state.buildValues
                };
                // console.log(`game:  ${JSON.stringify(gameState)}`);
                resolve(gameState);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
                reject();
            });
    }); 
};

const Build = (state:GameState, setState:React.Dispatch<React.SetStateAction<GameState>>, status:PlayCanvas.Status, setStatus:React.Dispatch<React.SetStateAction<PlayCanvas.Status>>) => {

    const StatusLoad = ():Promise<PlayCanvas.Status> => {
        return new Promise((resolve, reject) => {
            // console.log(`get status`);
            fetch (`${toyStatusCoreUrl}`)
                .then(res => res.json())
                .then((res:Main.Status) => {
                    resolve(res.PlayCanvas);
                })
                .catch((error:any) => {
                    console.error(`error: ${error}`);
                    reject();
                });
        }); 
    };

    const StatusDisplay = () => {
        let isBuilderBusy:boolean = status.Activity != 'None';
        return (
            <>
                <Label color={isBuilderBusy ? "yellow" : "green"}>
                    Builder Status
                    <Label.Detail>
                        {isBuilderBusy ? "Building" : "Idle"}
                    </Label.Detail>
                </Label>
                {isBuilderBusy && (
                    <Label>
                        {status.AppName}
                        <Label.Detail>
                            {status.Version}
                        </Label.Detail>
                    </Label>
                )}
            </>
        );
    };

    const SelectContent = (config:Game.Config, contentIndex:ContentIndexType) => {
        let gameState:GameState = {
            configs     : state.configs,
            current     : state.current,
            initialized : state.initialized,
            buildValues : state.buildValues,
        };
        if (state.current.AppName == config.playcanvas.name && state.current.ContentIndex == contentIndex) {
            gameState.current.AppName = ``;
            gameState.current.ContentIndex = "None";
        } else {
            gameState.current.AppName = config.playcanvas.name;
            gameState.current.ContentIndex = contentIndex;
        }
        // console.log(`select: ${gameState.current.AppName} | ${gameState.current.ContentIndex}`);
        setState(gameState);
    };

    const EntryGame = (config:Game.Config) => {
        if (typeof(state.buildValues[config.game.Config]) == 'undefined') {
            state.buildValues[config.game.Config] = BuildValueDefault;
            setState(state);
        }

        let dropdownPlatform:DropdownItemProps[] = [
            { text: "Web", value: "Web" },
            { text: "Facebook", value: "Facebook" },
            { text: "Snapchat (Development Only)", value: "Snapchat" }
        ];

        let dropdownBackend:DropdownItemProps[] = [
            { text: "Cookies", value: "Cookies" },
            { text: "Replicant", value: "Replicant" },
            { text: "Nakama", value: "Nakama" }
        ];

        let dropdownDebug:DropdownItemProps[] = [
            { text: "None", value: 0 },
            { text: "VConsole", value: 1 }
        ];

        let triggerBuild = () => {
            let tmpBuildValue:BuildValue = state.buildValues[config.game.Config];
            // console.log(`[${config.game.Config}] trigger build: ${JSON.stringify(tmpBuildValue)}`);
            let url:URL = new URL(`${toyBuildCoreUrl}`);
            url.searchParams.set('n', config.game.Config);
            url.searchParams.set('b', tmpBuildValue.backend.toString());
            url.searchParams.set('p', tmpBuildValue.platform.toString());
            url.searchParams.set('d', tmpBuildValue.debug.toString());
            url.searchParams.set('v', tmpBuildValue.version);
            fetch (url)
                .then(res => res.json())
                .then((res:any) => {
                    // console.log(`build response: ${JSON.stringify(res)}`);
                })
                .catch((error:any) => {
                    console.error(`error: ${error}`);
                });
        };

        let setPlatformValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue:BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.platform = data.value as Game.Platform;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set platform: ${tmpBuildValue.platform}`);
            setState(state);
        };

        let setBackendValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue:BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.backend = data.value as Game.Backend;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set backend: ${tmpBuildValue.backend}`);
            setState(state);
        };

        let setDebugValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue:BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.debug = data.value as number == 1;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set debug: ${tmpBuildValue.debug}`);
            setState(state);
        };

        let setVersionValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
            let tmpBuildValue:BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.version = data.value as string;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set version: ${tmpBuildValue.version}`);
            setState(state);
        };

        let openInNewTab = (url:string) => {
            window.open(url, '_blank', 'noopener,noreferrer');
        };

        let isBuilderBusy:boolean = status.Activity != 'None';
        
        return (
            <Card key={config.game.Config}>
                <Card.Header>
                    <Label attached="top" size="large">{config.playcanvas.name}</Label>
                    <Image src={config.game.Thumbnail} fluid />
                    {config.builds.indexOf('Web') >= 0 ? (
                        <Button fluid primary onClick={() => openInNewTab(`${coreUrl}/toy/${config.playcanvas.name}/Web/`)}>Play web build</Button>
                    ) : (
                        <Button fluid primary disabled>Web build not available</Button>
                    )}
                </Card.Header>
                <Card.Content>
                    <Accordion>

                        <Accordion.Title
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Info`}
                            onClick={() => SelectContent(config, `Info`)}
                        >
                            <Icon name='dropdown' />
                            Info
                        </Accordion.Title>
                        <Accordion.Content
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Info`}
                        >
                            <Segment basic>
                                Facebook App ID
                                <Input fluid placeholder="app id"/>
                                Snapchat App ID
                                <Input fluid placeholder="app id"/>
                                <Divider hidden/>
                                <Button fluid>Update</Button>
                                <Dimmer active>
                                    <Loader>Work In Progress</Loader>
                                </Dimmer>
                            </Segment>
                        </Accordion.Content>
                        
                        <Accordion.Title
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Build`}
                            onClick={() => SelectContent(config, `Build`)}
                        >
                            <Icon name='dropdown' />
                            Build
                        </Accordion.Title>
                        <Accordion.Content
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Build`}
                        >
                            Version
                            <Input 
                                fluid 
                                placeholder="Version"
                                onChange={setVersionValue}    
                            />
                            Platform
                            <Dropdown
                                key={`${config.playcanvas.name}-Platform`}
                                placeholder='Platform'
                                fluid
                                selection
                                options={dropdownPlatform}
                                onChange={setPlatformValue}
                            />
                            Backend
                            <Dropdown
                                key={`${config.playcanvas.name}-Backend`}
                                placeholder='Backend'
                                fluid
                                selection
                                options={dropdownBackend}
                                onChange={setBackendValue}
                            />
                            Debug
                            <Dropdown
                                key={`${config.playcanvas.name}-Debug`}
                                placeholder='Debug'
                                fluid
                                selection
                                options={dropdownDebug}
                                onChange={setDebugValue}
                            />
                            <Divider hidden/>
                            <Button fluid disabled={isBuilderBusy} onClick={triggerBuild}>{isBuilderBusy ? "Busy..." : "Build"}</Button>
                        </Accordion.Content>

                        <Accordion.Title
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Archive`}
                            onClick={() => SelectContent(config, `Archive`)}
                        >
                            <Icon name='dropdown' />
                            Archive
                        </Accordion.Title>
                        <Accordion.Content
                            active={state.current.AppName === config.playcanvas.name && state.current.ContentIndex === `Archive`}
                        >
                            <Segment basic>
                                <List divided relaxed>
                                    <List.Item>
                                        <List.Icon name='download' size='large' verticalAlign='middle' link/>
                                        <List.Content>
                                            <List.Header>Version 0.0.1</List.Header>
                                            <List.Description>Created 2022-08-25 13:40:51</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='download' size='large' verticalAlign='middle' link/>
                                        <List.Content>
                                            <List.Header>Version 0.0.2</List.Header>
                                            <List.Description>Created 2022-08-25 13:40:51</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='download' size='large' verticalAlign='middle' link/>
                                        <List.Content>
                                            <List.Header>Version 0.0.3</List.Header>
                                            <List.Description>Created 2022-08-25 13:40:51</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                                <Dimmer active>
                                    <Loader>Work In Progress</Loader>
                                </Dimmer>
                            </Segment>
                            <Button fluid>Archive</Button>
                        </Accordion.Content>

                    </Accordion>
                </Card.Content>
            </Card>
        );
    };

    if (!state.initialized) {
        let gameState:GameState = {
            configs     : state.configs,
            current     : state.current,
            initialized : state.initialized,
            buildValues : state.buildValues,
        };
        GameLoad(gameState).then(setState);

        setInterval(() => {
            // console.log(`update status`);
            StatusLoad().then(setStatus);
        }, 1000);
    }

    let refreshList = () => {
        GameLoad(state).then(setState);
    };

    return (
        <SegmentGroup>
            <Segment>
                {StatusDisplay()}
            </Segment>
            <Segment>
                <Menu fluid>
                    <Menu.Item
                        name="Refresh Game List"
                        onClick={refreshList}
                        icon="refresh"
                    />
                </Menu>
                <CardGroup>
                    {state.configs.map(EntryGame)}
                </CardGroup>
            </Segment>
        </SegmentGroup>
    );
};

export default Build;