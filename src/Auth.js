import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'
import Sidebar from './Sidebar'
import Grid from '@material-ui/core/Grid'
import TruckTable from './TruckTable'
import Login from './Login'
import OrderTable from './OrderTable'
import Map from './Map'

///////////////////////////////////////////////////////////////////////////////////////////////
/// AUTH COMPONENT CONTAINS THE ROUTER, RESPONSIBLE FOR THE APP ROUTING /////// ///////////////
/// PASS THE ISAUTHENTICATED PROPS TO OTHER COMPONENTS ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


const styles = {
    mobileContent: {
        paddingTop: '20px',
        width: '100%'
    },
    content: {
        paddingTop: '20px'
    }
}

class Auth extends React.Component {
    constructor() {
        super();
        let sid = null, isAuthenticated = false
        if (window.sessionStorage.getItem("sid")) {
            console.log("USE SESSION STORAGE")
            sid = window.sessionStorage.getItem("sid")
            isAuthenticated = true
        }
        this.state = {
            isAuthenticated: isAuthenticated,
            sid: sid,
            onMobile: true
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ onMobile: window.innerWidth <= 720 })
    }

    authenticate = (sid) => {
        window.sessionStorage.setItem("sid", sid)
        this.setState({ isAuthenticated: true, sid: sid });
    }

    signout = () => {
        window.sessionStorage.clear()
        this.setState({ isAuthenticated: false, sid: null });
    }


    render() {
        return (
            <Router>
                <div>
                    <div>
                        <Sidebar />
                    </div>
                    <Grid container alignItems={'center'} justify={'center'} style={this.state.onMobile ? styles.mobileContent : styles.content}>
                        <Grid item xs={8}>
                            <Route exact path="/" render={() => (this.state.isAuthenticated ? <TruckTable onMobile={this.state.onMobile} sid={this.state.sid} /> : <Redirect to="/login" />)} />
                            <Route path="/orders" render={(props) => {
                                if (!this.state.isAuthenticated) return <Redirect to='/login' />
                                return (<OrderTable sid={this.state.sid} onMobile={this.state.onMobile} dialogOpen={props.location.state && props.location.state.dialogOpen} selectedVehicle={props.location.state ? props.location.state.vehicleId : null} />)
                        }} />
                            <Route path="/map" render={(props) => {
                                if (!this.state.isAuthenticated) return <Redirect to='/login' />
                                return (props.location.state ? <Map
                                    goToViewport={props.location.state.goToViewport}
                                    goToLat={parseFloat(props.location.state.goToLat)}
                                    goToLong={parseFloat(props.location.state.goToLong)}
                                    sid={this.state.sid} />
                                    : <Map sid={this.state.sid} />)
                            }} />
                            <Route path="/login" render={() => (this.state.isAuthenticated ? <Redirect to="/" /> : <Login authenticate={this.authenticate} />)} />
                            <Route path="/logout" render={() => (this.state.isAuthenticated ? <Logout signout={this.signout} /> : <Redirect to='/login' />)} />
                        </Grid>
                    </Grid>
                </div>
            </Router>
        )
    }
}

function Logout(props) {
    props.signout();
    return (
        <Redirect to='/' />
    );
}

export default Auth;