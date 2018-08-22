import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog'
import FlatButton from '@material-ui/core/Button';
import Axios from 'axios'
import ReactLoading from 'react-loading';
import truck_logo from './assets/volvo_truck.png';
import { Redirect } from 'react-router-dom';

/// FIRST COMPONENT, DISPLAY THE LIST OF TRUCKS, GOOD SAMPLE TO LEARN REACT ////
/// NOT EVEN RESPONSIVE DUE TO MATERIAL TABLE, HAVE TO BE FIX /////


const styles = {
    mobileTruckTable: {
        width: "350px",
    },
    mobileContainer: {
        width: "40%",
        paddingRight: "200px"
    },
    volvoTruckImg: {
        height: "20px",
        paddingRight: "5px"
    },
    hoverVolvoTruckImg: {
        height: "20px",
        paddingRight: "5px",
        cursor: 'pointer'
    },
    dialogContainer: {
        padding: "20px",
    },
    dialogText: {
        padding: "10px",
        fontFamily: "Arial"
    },
    loadingContainer: {
        marginTop: '20px',
        overflow: 'hidden'
    },
    navLink: {
        textDecoration: 'none'
    }
}

const Loading = (props) => (
    <Grid style={styles.loadingContainer} container alignItems={'center'} justify={'center'}>
        <Grid item xs={4}>
            <ReactLoading type={props.type || 'bars'} color='rgb(0,0,100)' />
        </Grid>
    </Grid>
)

class TruckTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trucks: null,
            isReady: false,
            hoverLogo: false,
            dialogOpen: false,
            dialogReady: false,
            currentTruckId: null,
            truckInfos: null,
            redirect: false
        }
        props.sid && this.truckCall(props.sid);
    }

    onHoverLogo = (evt) => {
        evt.preventDefault()
        this.setState({ hoverLogo: true })
    }

    openDialog = (evt) => {
        this.getTruckInfo(evt.target.id, this.props.sid)
        this.setState({
            dialogOpen: true,
            currentTruckId: evt.target.id,
            dialogReady: false,
            truckInfos: null
        })
    }

    closeDialog = (evt) => {
        this.setState({
            dialogOpen: false,
        })
    }

    handleDialog = (evt) => {
        evt.preventDefault()
        evt.persist()
        this.setState((prevState) => ({
            dialogOpen: !prevState.dialogOpen,
            currentTruckId: prevState.currentTruckId ? null : evt.target.id,
            dialogReady: false
        }))
    }

    handleGoToMap = () => {
        this.setState({
            redirect: true
        })
        this.closeDialog()
    }

    offHoverLogo = (evt) => {
        evt.preventDefault()
        this.setState({ hoverLogo: false })
    }

    truckCall = (sid) => {
        const url = `http://localhost:8080/api/trucks?sid=${sid}`
        Axios.get(url)
            .then(res => {
                const trucks = res.data
                this.setState({
                    trucks: trucks,
                    isReady: true
                })
            })
            .catch(err => {
                console.error(err);
            })
    }

    getTruckInfo = (vehicleId, sid) => {
        const url = `http://localhost:8080/api/truck/${vehicleId}?sid=${sid}`
        return Axios.get(url)
            .then(res => {
                console.log(res)
                this.setState({
                    dialogReady: true,
                    truckInfos: {
                        lat: res.data.lat,
                        long: res.data.long
                    }
                })
            })
            .catch(err => {
                console.error(err)
                this.setState({
                    dialogReady: false,
                    truckInfos: null
                })
            })
    }

    renderDialog = () => {
        const dialogMsg = this.state.dialogReady &&
            <div style={styles.dialogText}>
                <span> Last known position of the truck : </span> <br />
                <span> Latitude = {this.state.truckInfos.lat} </span> <br />
                <span> Longitude = {this.state.truckInfos.long} </span> <br />
            </div>
        return (
            <Dialog maxWidth="md" open={this.state.dialogOpen} style={styles.dialogContainer}>
                <DialogTitle> Truck informations </DialogTitle>
                {this.state.dialogReady ?
                    <Grid container direction={"column"} alignItems={'center'} >
                        <Grid item xs={12}>
                            {dialogMsg}
                        </Grid>
                        <Grid item xs={12}>
                            <FlatButton
                                color="primary"
                                onClick={this.handleGoToMap}
                                style={{ marginTop: "20px" }}
                            > See on map
                            </FlatButton>
                            <FlatButton
                                color="primary"
                                onClick={this.closeDialog}
                                style={{ marginTop: "20px" }}
                            > Ok
                        </FlatButton>
                        </Grid>
                    </Grid>
                    :
                    <Grid container justify={'center'} alignItems={'center'}>
                        <Grid item>
                            <Loading type={'bubbles'} />
                            <FlatButton
                                color="primary"
                                onClick={this.closeDialog}
                                style={{ marginTop: "20px" }}
                            > Close
                        </FlatButton>
                        </Grid>
                    </Grid>
                }

            </Dialog>
        )
    }

    render() {
        if (!this.state.isReady) return <Loading />
        if (this.state.redirect) return <Redirect to={{ pathname: '/map', state: { goToViewport: true, goToLat: this.state.truckInfos.lat, goToLong: this.state.truckInfos.long } }}/>
        return (
            <div style={this.props.onMobile ? styles.mobileContainer : null}>
                {this.renderDialog()}
                <Table style={this.props.onMobile ? styles.mobileTruckTable : null}>
                    <TableHead>
                        <TableRow>
                            <TableCell> #id </TableCell>
                            <TableCell> Name </TableCell>
                            <TableCell> VIM </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.trucks.map((truck, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <img id={truck.vehicleId[0].id[0]}
                                            alt="TruckImg"
                                            onMouseOver={this.onHoverLogo}
                                            onMouseLeave={this.offHoverLogo}
                                            onClick={this.openDialog}
                                            style={this.state.hoverLogo ? styles.hoverVolvoTruckImg : styles.volvoTruckImg}
                                            src={truck_logo}
                                        />
                                        {truck.vehicleId[0].id[0]}
                                    </TableCell>
                                    <TableCell> {truck.displayName} </TableCell>
                                    <TableCell> {truck.vin} </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }

}

export default TruckTable;