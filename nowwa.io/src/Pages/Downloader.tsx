import { update } from 'node-7z';
import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form, Table } from 'semantic-ui-react';
import CONQUER from '../Frontend/CONQUER';
import { IndexState } from './Index';
import { UpdateComponentState } from './Utils/Helpers';

export type DownloaderState = {
    initialized: boolean,
    isBusy: boolean,
    files: ({ url: string, fileName: string } & {[key:string]:any})[],
    needRefresh: boolean
}

export const DownloaderStateDefault: DownloaderState = {
    initialized: false,
    isBusy: false,
    files: [],
    needRefresh: false,
}

export const DownloaderInit = (): Promise<DownloaderState> => {
    return Promise.resolve({
        initialized: true,
        isBusy: true,
        files: [],
        needRefresh: false
    });
};

const Downloader = (state: DownloaderState, setState: React.Dispatch<React.SetStateAction<DownloaderState>>, indexState: IndexState) => {


    let updateState = (updates: Partial<DownloaderState>) => {
        let newState = UpdateComponentState<DownloaderState>(state, updates);
        setState(newState);
    };

    if (!state.initialized) {
        DownloaderInit().then((newState: DownloaderState) => {
            updateState(newState);
            let avatarID:string = indexState.account!.avatarID;
            CONQUER.FILE.get({
                avatarID: avatarID
            })
                .then((res) => {
                    updateState({
                        isBusy: false,
                        files: res.result,
                        initialized: true
                    });
                });
        });
    }

    let refresh = () => {
        updateState({
            isBusy: true,
            needRefresh: false
        });
        let avatarID:string = indexState.account!.avatarID;
        CONQUER.FILE.get({
            avatarID: avatarID
        })
            .then((res) => {
                updateState({
                    isBusy: false,
                    files: res.result.files
                });
            });
    };

    if (state.needRefresh) {
        refresh();
    }

    const SelectFile = (url: string) => {
        CONQUER.FILE.download(url);
    };

    const EntryFile = (filename: string, url:string) => {
        return (
            <Table.Row key={filename}>
                <Table.Cell collapsing>
                </Table.Cell>
                <Table.Cell onClick={() => { SelectFile(url); }} selectable>
                    <a href='#'>
                        <Icon color='black' name='file' />
                        {filename}
                    </a>
                </Table.Cell>
            </Table.Row>
        );
    };

    return (
        <>
            <Segment>
                <Table selectable sortable striped>
                    <Table.Header>
                        <Table.Row key={`0`} active>
                            <Table.Cell width='1'>
                                <Button onClick={refresh} disabled={state.isBusy}>
                                    <Icon name='refresh'></Icon>
                                </Button>
                            </Table.Cell>
                            <Table.Cell>Name</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(state.files && state.files.length > 0) ? 
                            state.files.map((entry: { url: string, fileName: string }) => {
                                // console.log(`file: ${file}`);
                                return EntryFile(entry.fileName, entry.url);
                            }) :
                            <></>
                        }
                    </Table.Body>
                </Table>
            </Segment>
        </>
    );
}

export default Downloader;