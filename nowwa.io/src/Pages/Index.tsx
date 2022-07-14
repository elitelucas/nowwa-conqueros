import React from 'react';
import Top from './Top';
import Menu from './Menu';

class Index extends React.Component {

    constructor (props:any) {
        super(props);
    }

    public render () {
        return (
            <body>
                <link data-async
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
                <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script>
        
                <div id="root">
                    <Top />
                    <Menu />
                </div>
                
            </body>
        );
    }
}

export default Index;