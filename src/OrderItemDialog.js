import React from 'react'
import { Dialog, Button, Grid, Input, FormControl, Typography, DialogTitle, MenuItem, Select, TextField } from '../node_modules/@material-ui/core';
import Axios from '../node_modules/axios';


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////// THIS PART IS NOT FINISHED, NOT FUNCTIONNAL ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////



const activities = ["UNKNOWN", "PICK_UP_GOODS", "PICK_UP_TRAILER", "UNLOAD_GOODS", "UNLOAD_TRAILER", "LOAD_TRAILER",
    "DELIVER_TRAILER", "PICK_UP_CONTAINER", "DELIVER_CONTAINER", "CLEAN_TANK", "DUE_FOR_SERVICE"]

class OrderItemDialog extends React.Component {
    state = {
        client: '',
        lieu: '',
        POI: [],
        forms: [],
        orderItemNumber: '',
        selectedActivity: '',
        selectedForm: '',
        selectedToDate: '',
        selectedFromDate: '',
        selectedPOI: ''
    }

    componentDidMount() {
        this.getPOIs()
        this.getForms()
    }

    handleInputChange = prop => evt => {
        this.setState({
            [prop]: evt.target.value
        })
    }

    handleSelectChange = prop => evt => {
        this.setState({ [prop]: evt.target.value })
    }

    addOrderItem = () => {
        const { client, lieu, orderItemNumber, selectedActivity, selectedForm, selectedFromDate, selectedPOI, selectedToDate } = this.state
        const orderItem = {
            client: client,
            lieu: lieu,
            orderItemNumber: orderItemNumber,
            activity: selectedActivity,
            form: selectedForm,
            fromDate: selectedFromDate,
            toDate: selectedToDate,
            POI: selectedPOI
        }
        this.props.addOrderItem(orderItem)
        this.setState({
            client: '',
            lieu: '',
            orderItemNumber: '',
            selectedActivity: '',
            selectedForm: '',
            selectedToDate: '',
            selectedFromDate: '',
            selectedPOI: ''
        })
        this.props.close()
    }

    getPOIs = () => {
        const url = `http://localhost:8080/api/poi?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                const POI = res.data
                this.setState({ POI })
            })
            .catch(err => {
                console.log("Catch error: GET POIS")
                if (err.response && err.response.status === 410 & err.response.data === "logout") {
                    this.setState({ logout: true })
                }
                console.error(err)
            })
    }

    getForms = () => {
        const url = `http://localhost:8080/api/forms?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                const forms = res.data
                this.setState({ forms })
            })
            .catch(err => {
                console.log("Catch error: GET FORMS")
                if (err.response && err.response.status === 410 & err.response.data === "logout") {
                    this.setState({ logout: true })
                }
                console.error(err)
            })
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
            >
                <div style={{ width: "400px", height: "600px", overflow: "hidden" }}>
                    <DialogTitle style={{ marginBottom: "40px" }}> Add new order item </DialogTitle>
                    <Grid container direction="column" spacing={32} alignContent="center" alignItems="center" justify="center">
                        <Grid container direction="row" spacing={16} style={{ width: "350px" }}>
                            <Grid item >
                                <Typography variant='title' color='inherit'> Client : </Typography>
                                <FormControl style={{ width: "120px" }}>
                                    <Input
                                        id="client"
                                        type="text"
                                        value={this.state.client}
                                        onChange={this.handleInputChange('client')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item style={{ marginLeft: "50px" }} >
                                <Typography variant='title' color='inherit'> Lieu : </Typography>
                                <FormControl style={{ width: "120px" }}>
                                    <Input
                                        id="lieu"
                                        type="text"
                                        value={this.state.Lieu}
                                        onChange={this.handleInputChange('lieu')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant='title' color='inherit'> Order Item number : </Typography>
                            <FormControl style={{ width: "200px" }}>
                                <Input
                                    id="orderItemNumber"
                                    type="text"
                                    value={this.state.orderItemNumber}
                                    onChange={this.handleInputChange('orderItemNumber')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <Typography variant='title' color='inherit'> Activity : </Typography>
                            <FormControl style={{ width: "200px" }}>
                                <Select
                                    style={{ minWidth: "200px" }}
                                    id="activity"
                                    value={this.state.selectedActivity}
                                    onChange={this.handleSelectChange('selectedActivity')}
                                    input={<Input id="activityInput" />}
                                >
                                    {activities.map((activity, idx) => (
                                        <MenuItem key={idx} value={activity}>{activity}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <Typography variant='title' color='inherit'> POI : </Typography>
                            <FormControl style={{ width: "200px" }}>
                                <Select
                                    style={{ minWidth: "200px" }}
                                    id="poi"
                                    value={this.state.selectedPOI}
                                    onClick={() => { this.state.POI.length === 0 && this.getPOIs() }}
                                    onChange={this.handleSelectChange('selectedPOI')}
                                    input={<Input id="poiInput" />}
                                >
                                    {this.state.POI.map(poi => {
                                        const [id, name] = Object.entries(poi)[0]
                                        return <MenuItem key={id} value={id}>{name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <Typography variant='title' color='inherit'> Form : </Typography>
                            <FormControl style={{ width: "200px" }}>
                                <Select
                                    style={{ minWidth: "200px" }}
                                    id="form"
                                    onClick={() => { this.state.forms.length === 0 && this.getForms() }}
                                    value={this.state.selectedForm}
                                    onChange={this.handleSelectChange('selectedForm')}
                                    input={<Input id="formInput" />}
                                >
                                    {this.state.forms.map(form => {
                                        const [id, name] = Object.entries(form)[0]
                                        return <MenuItem key={id} value={id}>{name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container direction="row" spacing={16} style={{ width: "350px" }}>
                            <Grid item >
                                <form style={{ width: "120px" }} noValidate>
                                    <TextField
                                        id="fromDate"
                                        label="From"
                                        value={this.state.selectedFromDate}
                                        onChange={this.handleSelectChange('selectedFromDate')}
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </form>
                            </Grid>
                            <Grid item style={{ marginLeft: "50px" }} >
                                <form style={{ width: "120px" }} noValidate>
                                    <TextField
                                        id="toDate"
                                        label="To"
                                        type="date"
                                        value={this.state.selectedToDate}
                                        onChange={this.handleSelectChange('selectedToDate')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </form>
                            </Grid>
                        </Grid>
                        <Grid item style={{ paddingTop: "20px" }}>
                            <Button onClick={this.props.close}> Close </Button>
                            <Button onClick={this.addOrderItem}> Add </Button>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
        )
    }

}

export default OrderItemDialog