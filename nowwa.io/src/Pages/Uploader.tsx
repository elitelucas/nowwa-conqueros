import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONQUER from '../Frontend/CONQUER';
import { DownloaderState } from './Downloader';
import { IndexState } from './Index';
import { UpdateComponentState } from './Utils/Helpers';

export type UploaderState = {
    initialized: boolean,
    isBusy: boolean
}

export const UploaderStateDefault: UploaderState = {
    initialized: false,
    isBusy: false
}

export const UploaderInit = (): Promise<UploaderState> => {
    return Promise.resolve({
        initialized: true,
        isBusy: false
    });
};

const Uploader = (state: UploaderState, setState: React.Dispatch<React.SetStateAction<UploaderState>>, indexState: IndexState, updateDownloaderState: (updates: Partial<DownloaderState>) => void) => {

    if (!state.initialized) {
        UploaderInit().then(setState);
    }

    let updateState = (updates: Partial<UploaderState>) => {
        let newState = UpdateComponentState<UploaderState>(state, updates);
        setState(newState);
    };

    let onLoad = () => {
        console.log('done!');
    };

    let uploadFile = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
            updateState({
                isBusy: true
            });
            let file = ((e.target) as HTMLInputElement).files![0];
            
            let avatarID:string = indexState.account!.avatarID;

            await CONQUER.FILE.set(
            {
                fileName: file.name,
                content: file,
                avatarID: avatarID
            })

            let res = await CONQUER.FILE.get({
                avatarID: avatarID
            })
            updateDownloaderState({
                isBusy: false,
                files: res.result
            });
            updateState({
                isBusy: false
            });
        }
        input.click();
    };

    return (
        <>
            <Segment>
                <Button onClick={uploadFile} disabled={state.isBusy}>Upload File</Button>
            </Segment>
        </>
    );
}

export default Uploader;