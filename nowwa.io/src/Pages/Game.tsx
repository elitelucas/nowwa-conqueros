import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, CardGroup } from 'semantic-ui-react';
import { toyFullUrl } from "../Core/Environment";

export interface GameConfig {
    Thumbnail   : string,
    AppName     : string
}

export interface GameProps {
    configs : GameConfig[],
    current : string
}

export const GamePropsDefault:GameProps = {
    configs : [],
    current : "home"
}

const Game = (props:GameProps) => {
    const [value, setValue] = useState(props);

    const retryInterval:number = 1000;

    const GetGames = () => {
        console.log(`get games`);
        fetch (`${toyFullUrl}`)
            .then(res => res.json())
            .then((res:any) => {
                console.log(`res:  ${JSON.stringify(res)}`);
                setValue(res);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
            });
    };
    
    const EntryGame = (config:GameConfig) => {
        return (
            <Card>
                <Card.Header>
                    <Label>
                        {config.AppName}
                    </Label>
                </Card.Header>
                <Card.Content>
                    <Image src={config.Thumbnail}></Image>
                </Card.Content>
            </Card>
        );
    };

    useEffect(() => {
        // let refresh = setTimeout(() => {
        //     console.log('retru');
        //     GetGames();
        // }, retryInterval);

        // return () => {
        //     clearTimeout(refresh);
        // };
        setTimeout(() => {
            console.log('retru');
            GetGames();
        }, retryInterval);
    }, []); 

    return (
        <SegmentGroup>
            <Segment>
                <CardGroup>
                    {value.configs.map(EntryGame)}
                </CardGroup>
            </Segment>
        </SegmentGroup>
    );
};

export default Game;