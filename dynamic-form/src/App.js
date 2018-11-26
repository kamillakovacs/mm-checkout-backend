import React, { Component } from 'react';
import './App.css';
import DynamicForm from './components/DynamicForm';

class App extends Component {
  state = {
    data: [
      {energy: 1, favorite: 2, feeling: 3, rating: 4},
      {energy: 1, favorite: 2, feeling: 3, rating: 4},
      {energy: 1, favorite: 2, feeling: 3, rating: 4},
      ] 
  }
  
  callBackendAPI = async () => {
    const response = await fetch('/');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  onSubmit = (model) => {
    alert(JSON.stringify(model));
    // this.setState({
    //   data: [model, ...this.state.data]
    // })
    fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {model} ),
    })
    console.log(model)
  }

  render() {
    return (
      <div className="App">
       <DynamicForm className="form"
        title = "Feedback" 
        model = {[
          {key: "energy", label: "Energy", type: "number", props: {required: true}},
          {key: "favorite", label: "Favorite", type: "number", props: {required: true}},
          {key: "feeling", label: "Feeling", type: "number", props: {required: true}},
          {key: "rating", label: "Rating", type: "number", props: {required: true}},
        ]}
        onSubmit = {(model) => {this.onSubmit(model)}}
       />

       <pre style = {{width:"300px"}}>
        {JSON.stringify(this.state.data)}
       </pre>
      </div>
    );
  }
}

export default App;
