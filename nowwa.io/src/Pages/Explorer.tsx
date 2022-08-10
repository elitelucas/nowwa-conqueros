import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox } from 'semantic-ui-react';
import { storageFullUrl } from "../Core/Environment";

export interface ExplorerProps {
    files   : string[],
    folders : string[],
    current : string
}

export const ExplorerPropsDefault:ExplorerProps = {
    files   : [],
    folders : [],
    current : "home"
}

const Explorer = (props:ExplorerProps) => {
    const [value, setValue] = useState(props);

    const retryInterval:number = 1000;

    const SelectFile = (path:string) => {
        console.log(`select file: ${path}`);
        if (path.length > 0 && path[0] != '/') {
            path = `/${path}`; 
        }
    };

    const SelectFolder = (path:string) => {
        console.log(`select folder: ${path}`);
        if (path.length > 0 && path[0] != '/') {
            path = `/${path}`;
        }
        console.log(`fetch: ${storageFullUrl}${path}`);
        fetch (`${storageFullUrl}${path}`)
            .then(res => res.json())
            .then((res:any) => {
                res.current = path;
                console.log(`res:  ${JSON.stringify(res)}`);
                setValue(res);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
            });
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

    useEffect(() => {
        setTimeout(() => {
            SelectFolder(value.current);
        }, retryInterval);
    }, []); 

    return (
        <SegmentGroup>
            <Segment>
                {CreateBreadcrumb(value.current)}
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
                        {value.folders.map(folder => {
                            return EntryFolder(`${value.current}/${folder}`);
                        })}
                        {value.files.map(file => {
                            return EntryFile(`${value.current}/${file}`);
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