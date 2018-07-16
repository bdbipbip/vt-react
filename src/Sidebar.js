import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom';
import logo from './assets/volvo_logo.png';
import IconButton from "@material-ui/core/IconButton";
import Grid from '@material-ui/core/Grid';
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const styles = {
    burger: {
        bmBurgerBars: {
            background: '#373a47'
        },
        bmCrossButton: {
            height: '24px',
            width: '24px'
        },
        bmCross: {
            background: 'white'
        },
        bmMenu: {
            background: 'rgb(0,0,100)',
            padding: '1em 1em 0',
            fontSize: '1.15em',
            width: '150px',
            overflow: 'hidden'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em'
        },
        bmMenuWrap: {
            width: '150px'
        },
        bmItem: {
            display: 'inline-block'
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        }
    },
    largeBurger: {
        bmBurgerBars: {
            background: '#373a47'
        },
        bmCrossButton: {
            height: '40px',
            width: '40px'
        },
        bmCross: {
            background: 'white',
            fontSize: "1em"
        },
        bmMenu: {
            background: 'rgb(0,0,100)',
            padding: '1em 1.2em 0',
            fontSize: '2em',
            width: '300px',
            overflow: 'hidden'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '1em'
        },
        bmMenuWrap: {
            width: '300px'
        },
        bmItem: {
            display: 'inline-block'
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        }
    },
    largeMenuButton: {
        color: "white",
        height: "90px",
        width: "90px",
        backgroundColor: "transparent",
    },
    menuButton: {
        color: "white",
        backgroundColor: "transparent",
    },
    largeMenuButtonHover: {
        color: "white",
        height: "90px",
        width: "90px",
        backgroundColor: "rgb(0,0,60)",
    },
    menuButtonHover: {
        color: "white",
        backgroundColor: "rgb(0,0,60)",
    },
    burgerIcon: {
        fontSize: "40px",
    },
    logo: {
        height: "35px"
    },
    largeBurgerIcon: {
        fontSize: "75px",
        paddingBottom: "0px"
    },
    largeLogo: {
        height: "70px"
    },
    header: {
        backgroundColor: "rgb(0,0,100)",
        height: "80px"
    },
    largeHeader: {
        backgroundColor: "rgb(0,0,100)",
        height: "150px"
    },
    toolbar: {
        height: "100%"
    },
    title: {
        fontSize: "1.5em",
        paddingRight: "",
        fontWeight: "bold",
        fontFamily: "Arial white"
    },
    largeTitle: {
        fontSize: "2.5em",
        fontWeight: "bold",
        fontFamily: "Arial white"
    },
    navLink: {
        textDecoration: 'none',
        color: 'white'
    },
    hoverNavLink: {
        textDecoration: 'none',
        color: '#565b70'
    }
};



class Sidebar extends Component {
    state = {
        onMobile: false,
        openMenu: false,
        burgerHover: false,
        navLinks: [
            false,
            false,
            false,
            false
        ]
    };

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({onMobile: window.innerWidth < 720});
    }

    handleMenuClick = (evt) => {
        evt.preventDefault();
        this.setState(prevState => ({ openMenu: !prevState.openMenu }));
    }

    handleMenuChange = (state) => {
        this.setState({
            openMenu: state.isOpen
        });
    }

    changeBurgerHover = (evt) => {
        evt.preventDefault();
        this.setState(prevState => ({
            burgerHover: !prevState.burgerHover
        }));
    }

    renderHeaderBar = () => (
        <div style={{ flexGrow: 1 }}>
            <AppBar style={this.state.onMobile ? styles.header : styles.largeHeader}>
                <Toolbar style={styles.toolbar}>
                    <Grid container direction='row' spacing={8}>
                        <Grid item container xs={4} sm={4} md={3} lg={2} alignItems={'center'} justify={'flex-start'}>
                            <Grid item>
                                <IconButton style={this.state.burgerHover ? (this.state.onMobile ? styles.menuButtonHover : styles.largeMenuButtonHover) : (this.state.onMobile ? styles.menuButton : styles.largeMenuButton) } onMouseEnter={this.changeBurgerHover} onMouseLeave={this.changeBurgerHover} onClick={this.handleMenuClick}>
                                    <MenuIcon style={this.state.onMobile ? styles.burgerIcon : styles.largeBurgerIcon} />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <img style={this.state.onMobile ? styles.logo : styles.largeLogo} alt="logo" src={logo} />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems={'center'} xs={8} sm={8} md={9} lg={10} justify={"center"} >
                            <Grid item>
                                <span style={this.state.onMobile ? styles.title : styles.largeTitle}>VT React Application</span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )

    changeNavLinkHover = (idx, evt) => {
        evt.preventDefault();
        let newState = this.state.navLinks;
        newState[idx] = !newState[idx];
        this.setState({
            navLinks: newState
        });
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderHeaderBar()}
                </div>
                <Menu isOpen={this.state.openMenu} onStateChange={state => this.handleMenuChange(state)} customBurgerIcon={false} styles={this.state.onMobile ? styles.burger : styles.largeBurger}>
                    <div>
                        <NavLink id="Home" to='/' onMouseEnter={(evt) => this.changeNavLinkHover(0, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(0, evt)} style={this.state.navLinks[0] ? styles.hoverNavLink : styles.navLink}>
                            <span>Home</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Login" to='/login' onMouseEnter={(evt) => this.changeNavLinkHover(1, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(1, evt)} style={this.state.navLinks[1] ? styles.hoverNavLink : styles.navLink}>
                            <span>Login</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Public" to='/public' onMouseEnter={(evt) => this.changeNavLinkHover(2, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(2, evt)} style={this.state.navLinks[2] ? styles.hoverNavLink : styles.navLink}>
                            <span>Public</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Protected" to='/protected' onMouseEnter={(evt) => this.changeNavLinkHover(3, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(3, evt)} style={this.state.navLinks[3] ? styles.hoverNavLink : styles.navLink}>
                            <span>Protected</span>
                        </NavLink>
                    </div>
                </Menu>
            </div>
        );
    }

}

export default Sidebar;