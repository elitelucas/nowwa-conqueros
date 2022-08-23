import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, CardGroup } from 'semantic-ui-react';
import { toyFullUrl } from "../Core/Environment";

export type GameConfig = {
    Thumbnail   : string,
    AppName     : string
}

export type GameState = {
    initialized : boolean,   
    configs     : GameConfig[]
}

export const GameStateDefault:GameState = {
    initialized : false,
    configs     : []
}

export const GameLoad = (state:GameState):Promise<GameState> => {
    return new Promise((resolve, reject) => {
        console.log(`get games`);
        fetch (`${toyFullUrl}`)
            .then(res => res.json())
            .then((res:GameState) => {
                res.initialized = true;
                console.log(`game:  ${JSON.stringify(res)}`);
                resolve(res);
            })
            .catch((error:any) => {
                console.error(`error: ${error}`);
                reject();
            });
    }); 
};


const Game = (state:GameState, setState:React.Dispatch<React.SetStateAction<GameState>>) => {

    if (!state.initialized) {
        GameLoad(state).then(setState);
    }

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

    return (
        <SegmentGroup>
            <Segment>
                <CardGroup>
                    {state.configs.map(EntryGame)}
                </CardGroup>
            </Segment>
        </SegmentGroup>
    );
};

export default Game;