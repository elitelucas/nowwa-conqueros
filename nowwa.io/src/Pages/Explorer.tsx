import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider } from 'semantic-ui-react';
import Storage from '../Core/Storage';

const url:string = `http://127.0.0.1:9000/`;

export interface ExplorerProps {
    files   : string[],
    folders : string[],
    current : string
}

export const ExplorerPropsDefault:ExplorerProps = {
    files   : [],
    folders : [],
    current : ""
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
        fetch (`${url}${Storage.ExplorerUrl}${path}`)
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

    const CreateBreadcrumb = (path:string) => {
        let folders:string[] = path.split('/');
        if (folders[0].length == 0) {
            folders.splice(0, 1);
        }
        return (
            <Breadcrumb>
                <BreadcrumbSection link onClick={(e,p) => { console.log(`p: ${JSON.stringify(p)}`); SelectFolder (``); }}>
                    Home
                </BreadcrumbSection>
            {folders.map((folder, index) => {
                return (
                    <>
                        <BreadcrumbDivider><Icon name='angle right'/></BreadcrumbDivider>
                        <BreadcrumbSection key={folder} link onClick={(e,p) => { SelectFolder (path); }}>
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
            <Item key={path} onClick={() => { SelectFile(`${path}`); } }>
                <Label>
                    <Icon name="file"/>
                    {file}
                </Label>
            </Item>
        );
    };
    
    const EntryFolder = (path:string) => {
        let paths:string[] = path.split('/');
        let folder:string = paths[paths.length - 1];
        return (
            <Item key={path} onClick={() => { SelectFolder(`${path}`); } }>
                <Label>
                    <Icon name="folder"/>
                    {folder}
                </Label>
            </Item>
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
                <List selection>
                    {value.files.map(file => {
                        return EntryFile(`${value.current}/${file}`);
                    })}
                    {value.folders.map(folder => {
                        return EntryFolder(`${value.current}/${folder}`);
                    })}
                </List>
            </Segment>
        </SegmentGroup>
    );
};

export default Explorer;