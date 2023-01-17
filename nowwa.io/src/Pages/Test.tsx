import { equal } from 'assert';
import React, { useState, useEffect } from 'react';
import { Icon, Header, Label, Segment, Button, Card, Image, Item, Breadcrumb, List, SegmentGroup, BreadcrumbSection, BreadcrumbDivider, Table, Checkbox, Embed, ButtonGroup, Divider, Grid, TextArea, Form } from 'semantic-ui-react';
import { Client, RpcResponse, Session } from '@heroiclabs/nakama-js';

export type TestState = {
    initialized: boolean,
    count: number,
}

export const TestStateDefault: TestState = {
    initialized: false,
    count: 0,
}

class Test extends React.Component{
    constructor(props: TestState){
        super(props);
        this.state = props;
        this.increase = this.increase.bind(this);
    }
     
    increase(){
        this.setState({count : (this.state as TestState).count + 1});
    }
 
    render(){
        return (
            <div style={{margin:'50px'}}>
               <h1>Welcome to Geeks for Geeks </h1>
               <h3>Counter App using Class Component : </h3>
               <h2> {(this.state as TestState).count}</h2> 
               <button onClick={this.increase}> Add</button>
 
            </div>
        )
    }
}
 
export default Test;