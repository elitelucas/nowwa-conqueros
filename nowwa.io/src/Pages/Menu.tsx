import React from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image } from 'semantic-ui-react';

class Menu extends React.Component {

    public render () {
        return (
            
            <Card.Group>
                <Card>
                    <Card.Content>
                        <Image 
                            floated='right'
                            size='mini'
                            src='/images/avatar/large/steve.jpg'
                        />
                        <Card.Header>TOY Games</Card.Header>
                        <Card.Meta>25 games available</Card.Meta>
                        <Card.Description>
                            Compilation of web-playable <strong>TOY games</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                            <Button color='green'>
                                Open
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Content>
                        <Image 
                            floated='right'
                            size='mini'
                            src='/images/avatar/large/steve.jpg'
                        />
                        <Card.Header>CI/CD</Card.Header>
                        <Card.Meta>3 platforms available</Card.Meta>
                        <Card.Description>
                            Automatically create game builds to <strong>various platforms</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                            <Button color='green'>
                                Open
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </Card.Group>
        );
    }

}

export default Menu;