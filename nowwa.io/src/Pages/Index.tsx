import React from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import Menu from './Menu';

class Index extends React.Component<{}, Index.IndexParams> {

    constructor (props:any) {
        super(props);
        this.state = {
            var1: "default var1"
        }
        this.updateVar1 = this.updateVar1.bind(this);
    }

    public updateVar1 (value:string) {
        this.setState({
            var1: value
        });
    }

    public render () {
        return (
            <div>
                {this.state.var1}
                <Top />
                <Menu />
            </div>
        );
    }
}

namespace Index {
    export type IndexParams = {
        var1: string;
    };
}

let root = ReactDOMClient.createRoot(document.getElementById('root'));
let index = <Index />;

root.render(index);