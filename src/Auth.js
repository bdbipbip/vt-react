import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import Button from '@material-ui/core/Button';
import Sidebar from './Sidebar';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100);
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

const Public = () => <h3> Public </h3>
const Protected = () => <h3> Protected </h3>

const styles = {
    FormContainer: {
        heigth: '400px',
        marginTop: '70px'
    },
    userNameFormControl: {
        width: '245px'
    },
    content: {
        paddingTop: '20px'
    },
    connectButton: {
        backgroundColor: 'rgb(0,0,100)'
    },
    hoverButton: {
        backgroundColor: 'rgb(0,0,60)'
    }
};


class Login extends Component {
    state = {
        redirect: false,
        password: '',
        username: '',
        showPassword: false,
        hoverLogin: false
    }

    handleChange = prop => evt => {
        this.setState({ [prop]: evt.target.value });
    }

    handleClickShowPassword = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    }

    onHoverButton = () => {
        this.setState({hoverLogin: true});
    }

    offHoverButton = (evt) => {
        this.setState({hoverLogin: false});
    }

    login = () => {
        console.log("LOGIN");
        fakeAuth.authenticate(() => {
            this.setState({ redirect: true });
        })
    }

    renderPasswordInput = () => {
        return (
            <Grid item>
                <FormControl >
                    <InputLabel>Password</InputLabel>
                    <Input
                        id="passwordInput"
                        type={this.state.showPassword ? "text" : "password"}
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                >
                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Grid>
        );
    }

    renderUsernameInput = () => {
        return (
            <Grid item>
                <FormControl style={styles.userNameFormControl}>
                    <InputLabel>Username</InputLabel>
                    <Input
                        id="usernameInput"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleChange('username')}
                    />
                </FormControl>
            </Grid>
        );
    }


    renderAuthForm = () => {
        return (
            <div style={styles.FormContainer}>
                <Grid container style={styles.GridContainer}>
                    <Grid item xs={12}>
                        <Grid container direction={"column"} alignItems={'center'} justify={'center'} spacing={40}>
                            {this.renderUsernameInput()}
                            {this.renderPasswordInput()}
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={this.state.hoverLogin ? styles.hoverButton : styles.connectButton}
                                    onClick={this.login}
                                    onMouseEnter={this.onHoverButton}
                                    onMouseLeave={this.offHoverButton}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }

    render() {
        const { redirect } = this.state;
        if (redirect) return <Redirect to="/" />
        return (
            <div>
                {this.renderAuthForm()}
            </div>
        );
    }

}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        fakeAuth.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    )} />
);

const AuthButton = withRouter(({ history }) => (
    fakeAuth.isAuthenticated ? (
        <p>
            Welcome! <button onClick={() => {
                fakeAuth.signout(() => history.push('/'))
            }}>Sign out</button>
        </p>
    ) : (
            <Login />
        )
))

export default function Auth() {
    return (
        <Router>
            <div>
                <div>
                    <Sidebar />
                </div>
                <div style={styles.content}>
                    <Route exact path="/" component={AuthButton} />
                    <Route path="/public" component={Public} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/protected" component={Protected} />
                </div>
            </div>
        </Router>
    )
}