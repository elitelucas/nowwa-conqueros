import React, { Component } from 'react';
import semantic, { IconProps, SemanticICONS, Icon, IconGroup } from 'semantic-ui-react';

class Index {

    public static getText (text:string):string {
        return `The Text is: ${text}`;
    }

    public static render (text:string) {
        let elm:React.ReactElement = (
            <div>
                <Icon name='smile'></Icon>
                this is the text: {text}
            </div>
        );
        return elm;
    }
}

export default Index;