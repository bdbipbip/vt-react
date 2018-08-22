import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Grid, Button, ListItem, List, ListItemText, Typography } from '@material-ui/core'
import OrderIcon from '@material-ui/icons/Assignment'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Axios from 'axios'
import ReactLoading from 'react-loading';
import OrderDialog from './OrderDialog'



//// ORDER TABLE IS THE ORDER PART, RESPONSIBLE FOR THE dialogOpen PROPS THAT OPEN ORDERDIALOG ///

const styles = {
    desktopLogo: {
        fontSize: "50px"
    },
    desktopPrimary: {
        fontSize: "1em"
    },
    desktopSecondary: {
        fontSize: "0.875em"
    }
}

class OrderTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ordersReady: false,
            orders: [],
            customers: [],
            trucks: [],
            dialogOpen: props.dialogOpen || false,
            selectedVehicleInDialog: props.selectedVehicle || ''
        }
        this.handleOrder()
        this.getCustomers()
        this.getTrucks()
    }

    openDialog = () => {
        this.setState({ dialogOpen: true })
    }

    closeDialog = () => {
        this.setState({ dialogOpen: false })
    }

    renderList = () => {
        const { orders } = this.state
        const { onMobile } = this.props
        return (
            <List>
                {orders.map(order => {
                    const primaryMsg = order.customer + " #" + order.id
                    const secondaryMsg = order.createdDate.toLocaleDateString("fr-FR") + " Customer Reference: " + order.customerRef
                    return (
                        <ListItem key={order.id}>
                            <OrderIcon style={onMobile ? null : styles.desktopLogo} />
                            <ListItemText primaryTypographyProps={onMobile ? null : { variant: "display1", color: "inherit" }}
                                primary={primaryMsg}
                                secondaryTypographyProps={onMobile ? null : { variant: "headline", color: "default" }}
                                secondary={secondaryMsg} />
                            <Button onClick={(evt) => this.deleteOrder(evt, order.id)}><DeleteIcon style={onMobile ? null : styles.desktopLogo} /></Button>
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    render() {
        const { onMobile } = this.props
        if (this.state.logout) return <Redirect to="/logout" />
        return (
            <div>
                <OrderDialog closeDialog={this.closeDialog} trucks={this.state.trucks} customers={this.state.customers} sid={this.props.sid} refreshOrders={this.handleOrder} open={this.state.dialogOpen} selectedVehicle={this.state.selectedVehicleInDialog} />
                <Grid container alignItems={'center'} style={{ paddingBottom: "20px" }}>
                    <Grid item xs={10}>
                        <Grid container justify={'center'}>
                            <Grid item>
                                <Typography variant={onMobile ? "display1" : "display2"} color="inherit" > Orders List </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justify={'flex-end'}>
                            <Grid item>
                                <Button variant="fab" color="primary" onClick={this.openDialog}>
                                    <AddIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction={'column'} spacing={8} justify={'center'} alignItems={'center'} >
                    <Grid item xs={12}>
                        {this.state.ordersReady !== null && (this.state.ordersReady ? this.renderList() : <ReactLoading type='bars' color='rgb(0,0,100)' />)}
                    </Grid>
                </Grid>
            </div>
        )
    }

    getCustomers = () => {
        const url = `http://localhost:8080/api/customers?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                const customers = res.data
                this.setState({ customers })
                console.log("Customers OK")
            })
            .catch(err => {
                console.log("Catch error: GET CUSTOMERS")
                if (err.response && err.response.status === 410 & err.response.data === "logout") {
                    this.setState({ logout: true })
                }
                console.error(err)
            })
    }

    getTrucks = () => {
        const url = `http://localhost:8080/api/trucks?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                const trucks = res.data
                this.setState({ trucks })
                console.log("Trucks OK")
            })
            .catch(err => {
                console.error(err);
            })
    }

    deleteOrder = (evt, orderId) => {
        evt.preventDefault()
        console.log("id = ", orderId)
        const url = `http://localhost:8080/api/orders/${orderId}?sid=${this.props.sid}`
        Axios.delete(url)
            .then(res => {
                console.log(res)
                if (res.status === 200) this.handleOrder()
            })
            .catch(err => {
                console.log("Catch error: DELETE ORDERS")
                console.error(err.response.message)
            })
    }

    handleOrder = () => {
        const url = `http://localhost:8080/api/orders?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                if (!res.data.map) return null
                const orders = res.data.map((order, idx) => ({
                    id: order.orderNumber[0],
                    createdDate: new Date(order.createTime[0].value[0]),
                    customer: order.customerDescription[0],
                    customerRef: order.orderCustomerRef[0]
                }))
                this.setState({ orders: orders, ordersReady: true })
                console.log("Orders OK")
            })
            .catch(err => {
                if (err.response && err.response.status === 410 & err.response.data === "logout") {
                    this.setState({ logout: true })
                }
                console.log("Catch error: GET ORDERS")
                console.error(err)
            })
    }
}

export default OrderTable