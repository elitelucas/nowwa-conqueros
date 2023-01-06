import React, { useState } from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Label } from 'semantic-ui-react';
import { IndexState } from './Index';
import Pages from './PAGES';
import { UpdateComponentState } from './Utils/Helpers';


export type YohamiState = {
    initialized: boolean,
    isBusy: boolean,
    firstEmail?:string,
    firstGuild?:{
        id:string,
        name:string,
    },
}

export const YohamiStateDefault: YohamiState = {
    initialized: false,
    isBusy: false
}


const Yohami = ( indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void ) => 
{
    /*

    STATE

    */

    const [state, setState] = useState(YohamiStateDefault);
  
    const updateState = (updates: Partial<YohamiState>) => {
        let newState = UpdateComponentState<YohamiState>(state, updates);
        setState(newState);
    };
 
    const myButton = function()
    {
        updateState( {
            firstEmail:"test email"
        })
    }

    console.log("YOHAMI REACT REFRESHED", Pages.fuckthis );

    return (
        <>

            <Label>Hello Test { Pages.fuckthis }</Label>
            <Button onClick={myButton} > click me</Button>
        </>
    );
}



export default Yohami;