import React from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image } from 'semantic-ui-react';
import Storage from '../Core/Storage';

class TheCard extends React.Component {
    render () {
        return (
            <Card>
                <Card.Content>
                    <Image 
                        floated='right'
                        size='mini'
                        src={`${Storage.FileUrl}/toy/ballblast.png`}
                    />
                    <Card.Header>TEST CARD</Card.Header>
                    <Card.Meta>25 games available</Card.Meta>
                    <Card.Description>
                        Compilation of web-playable <strong>TOY games</strong>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

class Menu extends React.Component<{}, { showHideCard1:boolean }> {

    constructor (props:any) {
        super(props);
        this.state = {
            showHideCard1: true
        }
        this.hideComponent = this.hideComponent.bind(this);
    }

    private hideComponent(name:string) {
        console.log(`name: ${name}`);
        switch (name) {
        case "showHideCard1":
            this.setState({ showHideCard1: !this.state.showHideCard1 });
            break;
        default:
            null;
        }
    }

    public componentDidMount() {
        setTimeout(() => {
            console.log('done');
            this.setState({
                showHideCard1: true
            });
        }, 1000);
    }

    public render () {
        const testCall = () => { console.log('test'); };
        return (
            <Card.Group>
                <Card>
                    <Card.Content>
                        <Image 
                            floated='right'
                            size='mini'
                            src={`${Storage.FileUrl}/toy/ballblast.png`}
                        />
                        <Card.Header>TOY Games</Card.Header>
                        <Card.Meta>10 games available</Card.Meta>
                        <Card.Description>
                            Compilation of web-playable <strong>TOY games</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                            <Button color='green' onClick={() => { this.hideComponent("showHideCard1") }}>
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
                            src={`${Storage.FileUrl}/toy/dartspvp.png`}
                        />
                        <Card.Header>CI/CD</Card.Header>
                        <Card.Meta>3 platforms available</Card.Meta>
                        <Card.Description>
                            Automatically create game builds to <strong>various platforms</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                            <Button color='green' onClick={testCall} ref={testCall}>
                                Open
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
                {this.state.showHideCard1 && <TheCard />}
            </Card.Group>
        );
    }

}

export default Menu;