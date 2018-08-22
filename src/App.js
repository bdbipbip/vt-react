import React, { Component } from 'react'
import Auth from './Auth'


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////// MAIN COMPONENT, ONMOBILE GESTION => RESPONSIVE ///////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


const styles = {
  auth: {
    marginTop: '80px',
    width: '100%'
  },
  largeAuth: {
    marginTop: '150px',
    width: '100%'
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      onMobile: true
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  resize() {
    this.setState({ onMobile: window.innerWidth <= 720 })
  }

  render() {
    return (
      <div>
        <div style={this.state.onMobile ? styles.auth : styles.largeAuth}>
          <Auth />
        </div>
      </div>

    )
  }
}

export default App
