import React from 'react';
import { Icon, Header, Label, Segment, Button } from 'semantic-ui-react';

class Top extends React.Component {

    public render () {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name='earlybirds' />
                    Nowwa IO
                </Header>
                <Button primary>Add Document</Button>
            </Segment>
        );
    }

}

export default Top;