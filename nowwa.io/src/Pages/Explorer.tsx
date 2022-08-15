import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox } from 'semantic-ui-react';
import { storageFullUrl } from "../Core/Environment";

export type ExplorerState = {
    initialized : boolean,
    files       : string[],
    folders     : string[],
    current     : string
}

export const ExplorerStateDefault:ExplorerState = {
    initialized : false,
    files       : [],
    folders     : [],
    current     : "/home"
}

export const ExplorerLoad = (state:ExplorerState, path:string):Promise<ExplorerState> => {
    return new Promise((resolve, reject) => {
        console.log(`load folder: ${path}`);
        if (path.length > 0 && path[0] != '/') {
            path = `/${path}`;
        }
        console.log(`fetch: ${storageFullUrl}${path}`);
        fetch (`${storageFullUrl}${path}`)
            .then(res => res.json())
            .then((res:ExplorerState) => {
                res.current = path;
                res.initialized = true;
                console.log(`state:  ${JSON.stringify(res)}`);
                resolve(res);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
                reject();
            });
    });
};

const Explorer = (state:ExplorerState, setState:React.Dispatch<React.SetStateAction<ExplorerState>>) => {

    if (!state.initialized) {
        ExplorerLoad(state, state.current).then(setState);
    }

    const SelectFile = (path:string) => {
        console.log(`select file: ${path}`);
        if (path.length > 0 && path[0] != '/') {
            path = `/${path}`; 
        }
    };

    const SelectFolder = (path:string) => {
        console.log(`select folder: ${path}`);
        ExplorerLoad(state, path).then(setState);
    };

    const CreatePathByIndex = (path:string, index:number) => {
        let folders:string[] = path.split('/');
        if (folders[0].length == 0) {
            folders.splice(0, 1);
        }
        if (index < 0 || index >= folders.length) {
            return ``;
        }
        let output = ``;
        for (let i:number = 0; i <= index; i++) {
            output += `/${folders[i]}`;
        }
        return output;
    };

    const CreateBreadcrumb = (path:string) => {
        let folders:string[] = path.split('/');
        if (folders[0].length == 0) {
            folders.splice(0, 1);
        }
        return (
            <Breadcrumb>
            {folders.map((folder, index) => {
                let tmpPath:string = CreatePathByIndex(path, index);
                console.log(`tmpPath: ${tmpPath}`);
                console.log(`folder: ${folder} | path: ${path} | `);
                return (
                    <>
                        <BreadcrumbDivider><Icon name='angle right'/></BreadcrumbDivider>
                        <BreadcrumbSection key={folder} link onClick={(e,p) => { SelectFolder (tmpPath); }}>
                            {folder}
                        </BreadcrumbSection>
                    </>
                );
            })}
            </Breadcrumb>
        );
    };
    
    const EntryFile = (path:string) => {
        console.log(`entryFile: ${path}`);
        let paths:string[] = path.split('/');
        let file:string = paths[paths.length - 1];
        return (
            <Table.Row>
                <Table.Cell collapsing>
                    <Checkbox key={path}></Checkbox>
                </Table.Cell>
                <Table.Cell key={path} onClick={() => {  SelectFile(`${path}`); } }>
                    <Icon name="file"/>
                    {file}
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    <Icon name="download"/>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    <Icon name="delete"/>
                </Table.Cell>
            </Table.Row>
        );
    };
    
    const EntryFolder = (path:string) => {
        console.log(`entryFolder: ${path}`);
        let paths:string[] = path.split('/');
        let folder:string = paths[paths.length - 1];
        return (
            <Table.Row>
                <Table.Cell collapsing>
                    <Checkbox key={path}></Checkbox>
                </Table.Cell>
                <Table.Cell key={path} onClick={() => { SelectFolder(`${path}`); } }>
                    <Icon name="folder"/>
                    {folder}
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    <Icon name="download"/>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    <Icon name="delete"/>
                </Table.Cell>
            </Table.Row>
        );
    };

    return (
        <SegmentGroup>
            <Segment>
                {CreateBreadcrumb(state.current)}
            </Segment>
            <Segment>
                <Table selectable sortable striped>
                    <Table.Header>
                        <Table.Row active>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>Name</Table.Cell>
                            <Table.Cell>Download</Table.Cell>
                            <Table.Cell>Delete</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {state.folders.map((folder:string) => {
                            console.log(`folder: ${folder}`);
                            return EntryFolder(`${state.current}/${folder}`);
                        })}
                        {state.files.map((file:string) => {
                            console.log(`file: ${file}`);
                            return EntryFile(`${state.current}/${file}`);
                        })}
                    </Table.Body>
                </Table>
            </Segment>
            <Segment>

            </Segment>
        </SegmentGroup>
    );
};

export default Explorer;