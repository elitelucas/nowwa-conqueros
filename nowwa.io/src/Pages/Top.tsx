import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu } from 'semantic-ui-react';
import { IndexProps } from './Index';

const Top = (props: IndexProps) => {

    const ShowExplorer = () => {
        props.SetDisplay('Explorer');
    };

    const ShowBuild = () => {
        props.SetDisplay('Build');
    };

    const ShowTest = () => {
        props.SetDisplay('Test');
    };

    return (
        <Menu fluid>
            <Menu.Item onClick={ShowExplorer}>
                <Icon name='file'></Icon>
                Explorer
            </Menu.Item>
            <Menu.Item onClick={ShowBuild}>
                <Icon name='cog'></Icon>
                Build
            </Menu.Item>
            <Menu.Item onClick={ShowTest}>
                <Icon name='cog'></Icon>
                Test
            </Menu.Item>
        </Menu>
    );

}

export default Top;