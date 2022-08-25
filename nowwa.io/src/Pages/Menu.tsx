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

    return (
        <ButtonGroup fluid>
            <Button fluid onClick={ShowExplorer}>
                    <Icon name="file"></Icon>
                    Explorer
            </Button>
            <Button fluid onClick={ShowBuild}>
                    <Icon name="cog"></Icon>
                    Build
            </Button>
        </ButtonGroup>
    );

}

export default Menu;