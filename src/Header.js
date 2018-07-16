import React from 'react'
import logo from './assets/volvo_logo.png'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import MenuIcon from '@material-ui/icons/Menu'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const styles = {
  menuButton: {
    color: 'white',
    paddingRight: '10px'
  },
  burgerIcon: {
    fontSize: '40px'
  },
  logo: {
    height: '35px'
  },
  header: {
    backgroundColor: 'rgb(0,0,100)',
    height: '80px'
  },
  toolbar: {
    height: '100%'
  },
  title: {
    fontSize: '1.5em',
    paddingRight: '',
    fontWeight: 'bold',
    fontFamily: 'Arial white'
  }
}

function HeaderBar () {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar style={styles.header}>
        <Toolbar style={styles.toolbar}>
          <Grid container direction='row' spacing={8}>
            <Grid item container xs={4} sm={3} md={2} lg={1} alignItems={'center'} justify={'flex-start'}>
              <Grid item>
                <IconButton style={styles.menuButton}>
                  <MenuIcon style={styles.burgerIcon} />
                </IconButton>
              </Grid>
              <Grid item >
                <img style={styles.logo} alt='logo' src={logo} />
              </Grid>
            </Grid>
            <Grid container item alignItems={'center'} xs={8} sm={9} md={10} lg={11} justify={'center'} >
              <Grid item>
                <span style={styles.title}>VT React Application</span>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HeaderBar
