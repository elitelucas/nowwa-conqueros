import React, { useState, useEffect } from "react";
import { Icon, Header, Label, Segment, Button } from 'semantic-ui-react';

const Status = () => {
    const [value, setValue] = useState({
        isPlaycanvasBusy: false,
        requestCount: 0
    });

    const retryInterval:number = 1000;

    useEffect(() => {
        setTimeout(() => {
            fetch ('http://127.0.0.1:9000/status')
                .then(res => res.json())
                .then((res:any) => {
                    // console.log(`res:  ${JSON.stringify(res)}`);
                    setValue({
                        isPlaycanvasBusy: res.isPlaycanvasBusy,
                        requestCount: res.requestCount
                    });
                })
                .catch((error:any) => {
                    console.error(`error: ${error}`);
                });
        }, retryInterval);
    }, [value]); 

    if (value.isPlaycanvasBusy) {
        return (
            <Label>PlayCanvas: Busy {value.requestCount}</Label>
        );
    } else {
        return (
            <Label>PlayCanvas: Available</Label>
        );
    }
};

export default Status;