import React, { Component } from 'react';
import './App.css';

import Nav from './components/Nav/Nav';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particle from './components/Particles/Particles';


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
  }
}

class App extends Component {

  constructor() {
    super(); 
    
    this.state = initialState;
  };

  loadUser = (data) => {
    this.setState({
      user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined,
      }  
    })
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  };

  displayFaceBox = (box) => {
    this.setState({box: box});
  };

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  };

  onSubmitChange = () => {
    
    this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3001/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        }) 
        .then(resp=> {return resp.json()})
        .then(response=> {
          if (response) {
            fetch('http://localhost:3001/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => {return response.json()})
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}));
              })
              .catch(console.log)
         }
          this.displayFaceBox(this.calculateFaceLocation(response));
      })
        
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  };

  render() {
    const {imageUrl, box, route, isSignedIn} = this.state;
            return (
                <div className='App'>
                  
                    <Particle className='particles'/>
                    <Nav 
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange} />
                    { route === 'home'
                     ? <div>
                        <Logo />
                        <Rank 
                        name={this.state.user.name}
                        entries={this.state.user.entries}
                        />
                        <ImageLinkForm 
                        onInputChange={this.onInputChange}
                        onSubmitChange={this.onSubmitChange} 
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl} />

                       </div> 
                     
                     : (
                        route === 'signIn' 
                        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
                       )
                    }
                </div>
               );
            }
};

export default App;