import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu } from 'semantic-ui-react';
import { IndexState } from './Index';

const Top = (setIndexState: (updates: Partial<IndexState>) => void) => {

    const ShowExplorer = () => {
        setIndexState({
            display: 'Explorer'
        });
    };

    const ShowBuild = () => {
        setIndexState({
            display: 'Build'
        });
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
        </Menu>
    );

}

export default Top;