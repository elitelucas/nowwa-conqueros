import React from 'react';
import { Icon, Button, Segment, ButtonGroup } from 'semantic-ui-react';
import Storage from '../Core/Storage';
import { IndexProps } from './Index';

const Menu = (props:IndexProps) => {

    const ShowExplorer = () => {
        props.SetDisplay('Explorer');
    };

    const ShowBuild = () => {
        props.SetDisplay('Build');
    };

    const ShowGame = () => {
        props.SetDisplay('Game');
    };

    return (
        <ButtonGroup>
            <Button onClick={ShowExplorer}>
                    <Icon name="file"></Icon>
                    Explorer
            </Button>
            <Button onClick={ShowBuild}>
                    <Icon name="cog"></Icon>
                    Build
            </Button>
            <Button onClick={ShowGame}>
                    <Icon name="gamepad"></Icon>
                    Games
            </Button>
        </ButtonGroup>
    );

}

export default Menu;