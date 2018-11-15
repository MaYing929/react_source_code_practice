import React from './react';
import ReactDom from './react-dom';


class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

class  Counter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            num:1
        }

    }
    componentWillUpdate() {
        console.log( 'update' );
    }

    componentWillMount() {
        console.log( 'mount' );
    }

    onClick(){
        this.setState({
            num:this.state.num + 1
        })
    }

    render(){

        return(
            <div>
                <Welcome name="sadc" />
                <Welcome name="lazy" />
                <Welcome name="safari" />
                <h1>hello yishu</h1>
                <h1>count:{this.state.num}</h1>
                <button onClick={()=>this.onClick()}>add</button>
            </div>
        )
    }
}


ReactDom.render(
    <Counter />,
    document.getElementById('root')
)