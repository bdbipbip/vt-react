import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import Button from '@material-ui/core/Button';
import Axios from 'axios'

//// LOGIN COMPONENT, GOOD EXAMPLE TO UNDERSTAND BASICS REACT FEATURES ///


const styles = {
    FormContainer: {
        heigth: '400px',
        marginTop: '10px'
    },
    userNameFormControl: {
        width: '245px'
    },
    connectButton: {
        backgroundColor: 'rgb(0,0,100)'
    },
    hoverButton: {
        backgroundColor: 'rgb(0,0,60)'
    },
    errorMessage: {
        fontFamily: 'Arial',
        color: 'red',
        fontSize: '1em',
        fontWeight: 'bold'
    },
    errorContainer: {
        marginTop: '30px'
    }
};


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            username: '',
            showPassword: false,
            hoverLogin: false,
            authFail: false
        }
    }

    handleChange = (prop) => (evt) => {    //eslint-disable-line
        this.setState({ [prop]: evt.target.value });
    }

    handleKeyPress = evt => {
        evt.charCode === 13 && this.login()
    }

    handleClickShowPassword = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    }

    onHoverButton = () => {
        this.setState({ hoverLogin: true });
    }

    offHoverButton = (evt) => {
        this.setState({ hoverLogin: false });
    }

    login = () => {
        Axios.post(`http://localhost:8080/api/login`, {
            headers: {
                "Access-Control-Request-Methods": "POST, OPTIONS",
                "Access-Control-Request-Header": "Content-Type"
            },
            username: this.state.username,
            password: this.state.password,
        })
            .then(res => {
                const sid = res.data;
                this.props.authenticate(sid);
            })
            .catch(err => {
                this.setState({ authFail: true });
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
                        onKeyPress={this.handleKeyPress}
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
                        onKeyPress={this.handleKeyPress}
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

    renderError = () => (
        <Grid style={styles.errorContainer} container alignItems={'center'} justify={'center'}>
            <Grid item>
                <span style={styles.errorMessage}> Wrong credentials, please try again </span>
            </Grid>
        </Grid>
    )

    render() {
        return (
            <div>
                {this.state.authFail && this.renderError()}
                {this.renderAuthForm()}
            </div>
        );
    }

}


export default Login;