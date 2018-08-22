import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom';
import logo from './assets/volvo_logo.png';
import IconButton from "@material-ui/core/IconButton";
import Grid from '@material-ui/core/Grid';
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";




//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////// HEADER BAR + SIDEBAR GESTION (use navlink to call react-router-dom) 
/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////




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
        height: "35px",
        width: '60px'
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
    titleContainer: {
        paddingRight: "20%",
    },
    title: {
        fontSize: "1.2em",
        fontWeight: "bold",
        fontFamily: "Arial white"
    },
    largeTitle: {
        fontSize: "2.5em",
        fontWeight: "bold",
        fontFamily: "Arial white"
    },
    largeTitleContainer: {
        paddingRight: "20%"
    },
    navLink: {
        textDecoration: 'none',
        color: 'white',
        padding: '5px'
    },
    hoverNavLink: {
        textDecoration: 'none',
        color: '#565b70',
        padding: '5px'
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
            false,
            false,
        ]
    };

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({ onMobile: window.innerWidth <= 720 });
    }

    closeMenu = evt => {
        this.setState({ openMenu: false });
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
                        <Grid item container xs={4} sm={4} md={3} lg={3} alignItems={'center'} justify={'flex-start'}>
                            <Grid item>
                                <IconButton style={this.state.burgerHover ? (this.state.onMobile ? styles.menuButtonHover : styles.largeMenuButtonHover) : (this.state.onMobile ? styles.menuButton : styles.largeMenuButton)} onMouseEnter={this.changeBurgerHover} onMouseLeave={this.changeBurgerHover} onClick={this.handleMenuClick}>
                                    <MenuIcon style={this.state.onMobile ? styles.burgerIcon : styles.largeBurgerIcon} />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <img style={this.state.onMobile ? styles.logo : styles.largeLogo} alt="logo" src={logo} />
                            </Grid>
                        </Grid>
                        <Grid container item alignItems={'center'} xs={8} sm={8} md={9} lg={9} justify={"center"} style={this.state.onMobile ? null : styles.largeTitleContainer}>
                            <Grid style={this.state.onMobile ? styles.titleContainer : null} item>
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
                            <span onClick={this.closeMenu}>Home</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Map" to='/map' onMouseEnter={(evt) => this.changeNavLinkHover(1, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(1, evt)} style={this.state.navLinks[1] ? styles.hoverNavLink : styles.navLink}>
                            <span onClick={this.closeMenu}>Map</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Orders" to='/orders' onMouseEnter={(evt) => this.changeNavLinkHover(4, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(4, evt)} style={this.state.navLinks[4] ? styles.hoverNavLink : styles.navLink}>
                            <span onClick={this.closeMenu}>Orders</span>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink id="Logout" to='/logout' onMouseEnter={(evt) => this.changeNavLinkHover(3, evt)} onMouseLeave={(evt) => this.changeNavLinkHover(3, evt)} style={this.state.navLinks[3] ? styles.hoverNavLink : styles.navLink}>
                            <span onClick={this.closeMenu}>Logout</span>
                        </NavLink>
                    </div>

                </Menu>
            </div>
        );
    }

}


export default Sidebar;