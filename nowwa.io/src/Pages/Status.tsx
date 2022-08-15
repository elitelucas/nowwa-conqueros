import React, { useEffect, useState } from 'react';
import { Icon, Header, Label, Segment, Button } from 'semantic-ui-react';
import Explorer from './Explorer';
import Status from './Status';

const Top = () => {

    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='earlybirds' />
                Nowwa IO
            </Header>
        </Segment>
    );

}

export default Top;