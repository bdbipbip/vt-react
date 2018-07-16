import React, { Component } from 'react';
import Auth from './Auth';


const styles = {
  auth: {
    marginTop: '80px',
    width: "100%"
  },
  largeAuth: {
    marginTop: '150px',
    width: "100%"
  }
};


class App extends Component {
  state = {
    onMobile: false
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({ onMobile: window.innerWidth < 720 });
  }

  render() {
    return (
      <div>
        <div style={this.state.onMobile ? styles.auth : styles.largeAuth}>
          <Auth />
        </div>
      </div>

    );
  }
}


export default App;
