import { stat } from 'fs';
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, CardGroup, Input, Select, Dropdown, DropdownItemProps, Accordion, LabelProps, Form, Grid, ButtonGroup, Divider, DropdownProps, InputOnChangeData, Loader, Dimmer, LabelDetail, Menu } from 'semantic-ui-react';
import Environment, { toyBuildUrl, toyStatusUrl, toyListUrl } from '../Core/CONFIG/Environment';
import Build from '../Core/GAME/Build';
import Main from '../Core/Main';
import Status from '../Core/GAME/Status';

type ContentIndexType = `None` | `Info` | `Build` | `Archive`;

type BuildValue = {
    backend: Build.Backend,
    debug: boolean | undefined,
    platform: Build.Platform,
    version: string
};

const BuildValueDefault: BuildValue = {
    backend: 'None',
    debug: undefined,
    platform: 'None',
    version: '',
}

export type BuildState = {
    initialized: boolean,
    configs: Build.Config[],
    current: {
        AppName: string,
        ContentIndex: ContentIndexType
    },
    buildValues: { [config: string]: BuildValue }
}

export const BuildStateDefault: BuildState = {
    initialized: false,
    configs: [],
    current: {
        AppName: ``,
        ContentIndex: `None`
    },
    buildValues: {}
}

export const BuildLoad = (state: BuildState): Promise<BuildState> => {
    return new Promise((resolve, reject) => {
        // console.log(`get games`);
        fetch(`${window.location.origin}${toyListUrl}`)
            .then(res => res.json())
            .then((res: BuildState) => {
                let gameState: BuildState = {
                    configs: res.configs,
                    current: state.current,
                    initialized: true,
                    buildValues: state.buildValues
                };
                // console.log(`game:  ${JSON.stringify(gameState)}`);
                resolve(gameState);
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
                reject();
            });
    });
};

const Builds = (state: BuildState, setState: React.Dispatch<React.SetStateAction<BuildState>>, status: Status.Detail, setStatus: React.Dispatch<React.SetStateAction<Status.Detail>>) => {

    if (typeof globalThis.extra == 'undefined') {
        globalThis.extra = {};
    }

    const StatusLoad = (): Promise<Status.Detail> => {
        return new Promise((resolve, reject) => {
            // console.log(`get status`);
            fetch(`${window.location.origin}${toyStatusUrl}`)
                .then(res => res.json())
                .then((res: Main.Status) => {
                    resolve(res.Builder);
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                    reject();
                });
        });
    };

    const StatusDisplay = () => {
        let isBuilderBusy: boolean = status.Activity != 'None';
        return (
            <>
                <Label color={isBuilderBusy ? 'yellow' : 'green'}>
                    Builder Status
                    <Label.Detail>
                        {isBuilderBusy ? 'Building' : 'Idle'}
                    </Label.Detail>
                </Label>
                {isBuilderBusy && (
                    <Label>
                        {status.AppName}
                        <Label.Detail>
                            {status.Platform}
                        </Label.Detail>
                        <Label.Detail>
                            v{status.Version}
                        </Label.Detail>
                    </Label>
                )}
            </>
        );
    };

    const SelectContent = (config: Build.Config, contentIndex: ContentIndexType) => {
        let gameState: BuildState = {
            configs: state.configs,
            current: state.current,
            initialized: state.initialized,
            buildValues: state.buildValues,
        };
        if (state.current.AppName == config.playcanvas.name && state.current.ContentIndex == contentIndex) {
            gameState.current.AppName = ``;
            gameState.current.ContentIndex = 'None';
        } else {
            gameState.current.AppName = config.playcanvas.name;
            gameState.current.ContentIndex = contentIndex;
        }
        // console.log(`select: ${gameState.current.AppName} | ${gameState.current.ContentIndex}`);
        setState(gameState);
    };

    const EntryGame = (config: Build.Config) => {
        if (typeof (state.buildValues[config.game.Config]) == 'undefined') {
            state.buildValues[config.game.Config] = BuildValueDefault;
            setState(state);
        }

        let buildValue: BuildValue = state.buildValues[config.game.Config];

        let dropdownPlatform: DropdownItemProps[] = [
            { text: 'Web', value: 'Web' },
            { text: 'Facebook', value: 'Facebook' },
            { text: 'Snapchat (Development Only)', value: 'Snapchat' },
            { text: 'Android', value: 'Android' },
            { text: 'iOS', value: 'iOS' }
        ];

        let dropdownBackend: DropdownItemProps[] = [
            { text: 'Cookies', value: 'Cookies' },
        ];
        if (buildValue.platform == 'Snapchat') {
            dropdownBackend.push({ text: 'Nakama', value: 'Nakama' });
        }
        if (buildValue.platform == 'Snapchat' || buildValue.platform == 'Facebook') {
            dropdownBackend.push({ text: 'Replicant', value: 'Replicant' });
        }

        let dropdownDebug: DropdownItemProps[] = [
            { text: 'None', value: 0 },
            { text: 'VConsole', value: 1 }
        ];

        let triggerBuild = () => {
            let tmpBuildValue: BuildValue = state.buildValues[config.game.Config];
            // console.log(`[${config.game.Config}] trigger build: ${JSON.stringify(tmpBuildValue)}`);
            let url: URL = new URL(`${window.location.origin}${toyBuildUrl}`);
            url.searchParams.set('n', config.game.Config);
            url.searchParams.set('p', tmpBuildValue.platform.toString());
            let tmpBackend: Build.Backend = tmpBuildValue.backend;
            if (tmpBackend != 'None' && tmpBackend != 'Cookies' && (tmpBuildValue.platform == 'Web' || tmpBuildValue.platform == 'Android')) {
                tmpBackend = 'Cookies';
            }
            url.searchParams.set('b', tmpBackend.toString());
            url.searchParams.set('d', tmpBuildValue.debug ? `1` : `0`);
            url.searchParams.set('v', tmpBuildValue.version);
            fetch(url)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`build response: ${JSON.stringify(res)}`);
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
            globalThis.extra.isBuildTriggered = true;
        };

        let setPlatformValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue: BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.platform = data.value as Build.Platform;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set platform: ${tmpBuildValue.platform}`);
            setState(state);
        };

        let setBackendValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue: BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.backend = data.value as Build.Backend;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set backend: ${tmpBuildValue.backend}`);
            setState(state);
        };

        let setDebugValue = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            let tmpBuildValue: BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.debug = data.value as number == 1;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set debug: ${tmpBuildValue.debug}`);
            setState(state);
        };

        let setVersionValue = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
            let tmpBuildValue: BuildValue = state.buildValues[config.game.Config];
            tmpBuildValue.version = data.value as string;
            state.buildValues[config.game.Config] = tmpBuildValue;
            console.log(`[${config.game.Config}] set version: ${tmpBuildValue.version}`);
            setState(state);
        };

        let openInNewTab = (url: string) => {
            window.open(url, '_blank', 'noopener,noreferrer');
        };

        let downloadFile = (filename: string, filepath: string) => {
            const a = document.createElement('a')
            a.href = filepath;
            a.download = filename;
            console.log(`download: ${filename}`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        let isBuilderBusy: boolean = status.Activity != 'None';

        let isBuildParameterFilled: boolean =
            (buildValue.backend != 'None') &&
            (buildValue.debug != undefined) &&
            (buildValue.platform != 'None') &&
            (buildValue.version != '');

        let apkPath: string = `${window.location.origin}/toy/${config.game.Folder}/app-debug.apk`;
        let apkFileName: string = `${config.playcanvas.name}.apk`;

        return (
            <Card key={config.game.Config}>
                <Card.Header>
                    <Label attached='top' size='large'>{config.playcanvas.name}</Label>
                    <Image src={config.game.Thumbnail} fluid />
                    {typeof config.builds != 'undefined' && typeof config.builds['Web'] != 'undefined' ? (
                        <Button fluid primary onClick={() => openInNewTab(`${window.location.origin}${config.builds['Web']}`)}><Icon name='world'></Icon>Play</Button>
                    ) : (
                        <Button fluid primary disabled><Icon name='world'></Icon>Build first!</Button>
                    )}
                    {typeof config.builds != 'undefined' && typeof config.builds['Android'] != 'undefined' ? (
                        <Button fluid primary onClick={() => downloadFile(`${apkFileName}`, `${config.builds['Android']}`)}><Icon name='android'></Icon>Download</Button>
                    ) : (
                        <Button fluid primary disabled><Icon name='android'></Icon>Build first!</Button>
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
                                <Input fluid placeholder='app id' />
                                Snapchat App ID
                                <Input fluid placeholder='app id' />
                                <Divider hidden />
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
                                placeholder='Version'
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
                            <Divider hidden />
                            <Button fluid disabled={isBuilderBusy || !isBuildParameterFilled} onClick={triggerBuild}>{isBuilderBusy ? 'Busy...' : 'Build'}</Button>
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
                                        <List.Icon name='download' size='large' verticalAlign='middle' link />
                                        <List.Content>
                                            <List.Header>Version 0.0.1</List.Header>
                                            <List.Description>Created 2022-08-25 13:40:51</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='download' size='large' verticalAlign='middle' link />
                                        <List.Content>
                                            <List.Header>Version 0.0.2</List.Header>
                                            <List.Description>Created 2022-08-25 13:40:51</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='download' size='large' verticalAlign='middle' link />
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

    let refreshList = () => {
        BuildLoad(state).then(setState);
    };

    if (!state.initialized) {
        let gameState: BuildState = {
            configs: state.configs,
            current: state.current,
            initialized: state.initialized,
            buildValues: state.buildValues,
        };
        BuildLoad(gameState).then(setState);

        setInterval(() => {
            // console.log(`update status`);
            StatusLoad().then((value: Status.Detail) => {
                if (value.Activity != 'None' && globalThis.extra.isBuildTriggered && !globalThis.extra.needRefresh) {
                    globalThis.extra.needRefresh = true;
                }
                if (value.Activity == 'None' && globalThis.extra.needRefresh) {
                    globalThis.extra.needRefresh = false;
                    globalThis.extra.isBuildTriggered = false;
                    refreshList();
                }
                setStatus(value);
            });
        }, 1000);
    }

    return (
        <SegmentGroup>
            <Segment>
                {StatusDisplay()}
            </Segment>
            <Segment>
                <Menu fluid>
                    <Menu.Item
                        name='Refresh Game List'
                        onClick={refreshList}
                        icon='refresh'
                    />
                </Menu>
                <CardGroup>
                    {state.configs.map(EntryGame)}
                </CardGroup>
            </Segment>
        </SegmentGroup>
    );
};

export default Builds;