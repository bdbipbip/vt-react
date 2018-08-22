import React, { Component } from 'react'
import { Dialog, DialogTitle, Typography, Button, Input, Grid, FormControl, Select, MenuItem } from '../node_modules/@material-ui/core';
import Axios from '../node_modules/axios';


/// ORDER DIALOG IS OPEN WHEN YOU CLICK ON ADD ORDER, BASED ON MATERIAL DIALOG /////

class OrderDialog extends Component {
    state = {
        height: 600,
        disabledAdd: true,
        orderId: '',
        customerRef: '',
        selectedCustomer: '',
        selectedVehicle: this.props.selectedVehicle || '',
        openOrderItemDialog: false,
        orderItems: []
    }


    addOrderItem = (orderItem) => {
        const height = this.state.height + 200
        this.setState({ orderItems: [...this.state.orderItems, orderItem], height })
    }


    openOrderItemDialog = () => {
        this.setState({ openOrderItemDialog: true })
    }

    closeOrderItemDialog = () => {
        this.setState({ openOrderItemDialog: false })
    }

    handleInputChange = prop => evt => {
        this.setState({ [prop]: evt.target.value })
    }

    handleSelectChange = evt => {
        const selectedCustomer = evt.target.value
        this.setState({ selectedCustomer })
    }

    handleVehicleSelect = evt => {
        const selectedVehicle = evt.target.value
        this.setState({ selectedVehicle })
    }

    addButtonIsDisable = () => {
        const { orderId, selectedCustomer, customerRef, selectedVehicle } = this.state
        if (orderId === '' | selectedCustomer === '' | customerRef === '' || selectedVehicle === '') return true
        return false
    }

    addOrder = () => {
        this.props.closeDialog()
        const { orderId, selectedCustomer, customerRef, selectedVehicle } = this.state
        const { sid } = this.props
        const url = `http://localhost:8080/api/orders?sid=${sid}`
        const datas = {
            orderId: orderId,
            customerId: selectedCustomer,
            customerRef: customerRef,
            vehicleId: selectedVehicle
        }
        Axios.post(url, datas)
            .then(res => {
                if (res.status === 200) this.props.refreshOrders()
            })
            .catch(error => {
                console.log("Catch error: ADD ORDER")
                console.log(error)
            })
    }


    /////// IN PROGRESS


    // renderOrderItemList = () => {
    //     console.log(this.state.orderItems.length)
    //     if (this.state.orderItems.length === 0) return (<span> No order items.. </span>)
    //     console.log(this.state.orderItems)
    //     return (
    //         <List style={{width: "200px"}}>
    //             {this.state.orderItems.map((orderItem, idx) => {
    //                 console.log(orderItem)
    //                 return (
    //                     <ListItem key={idx}>
    //                         <ListItemText primary={orderItem.activity + "   " + orderItem.fromDate} />
    //                     </ListItem>
    //                 )
    //             })}
    //         </List>
    //     )
    // }

    render() {
        return (
            <div>
                <Dialog open={this.props.open}>
                    <div style={{ width: "300px", overflowX: "hidden", height: this.state.height+"px" }}>
                        <DialogTitle style={{ marginBottom: "40px" }}> Add new order </DialogTitle>

                        <Grid container direction='column' alignItems='center' justify='center' spacing={32} >
                            <Grid item>
                                <Typography variant='title' color='inherit'> Order Id: </Typography>
                                <FormControl style={{ width: "200px" }}>
                                    <Input
                                        id="orderId"
                                        type="text"
                                        value={this.state.orderId}
                                        onChange={this.handleInputChange('orderId')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item >
                                <Typography variant='title' color='inherit'> Customer: </Typography>
                                <FormControl style={{ width: "200px" }}>
                                    <Select
                                        style={{ minWidth: "200px" }}
                                        id="customersSelect"
                                        value={this.state.selectedCustomer}
                                        onChange={this.handleSelectChange}
                                        input={<Input id="customerInput" />}
                                    >
                                        {this.props.customers.map(customer => {
                                            const [id, name] = Object.entries(customer)[0]
                                            return (
                                                <MenuItem key={id} value={id}>{name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item >
                                <Typography variant='title' color='inherit'> Assigned Vehicle: </Typography>
                                <FormControl style={{ width: "200px" }}>
                                    <Select
                                        style={{ minWidth: "200px" }}
                                        id="vehicleSelected"
                                        value={this.state.selectedVehicle}
                                        onChange={this.handleVehicleSelect}
                                        input={<Input id="vehicleSelected" />}
                                    >
                                        {this.props.trucks.map(truck => {
                                            const vehicleId = truck.vehicleId[0].id[0]
                                            const name = truck.displayName[0]
                                            return (
                                                <MenuItem key={vehicleId} value={vehicleId}>{name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Typography variant='title' color='inherit'> Customer Ref: </Typography>
                                <FormControl style={{ width: "200px" }}>
                                    <Input
                                        id="customerRef"
                                        type="text"
                                        value={this.state.customerRef}
                                        onChange={this.handleInputChange('customerRef')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button onClick={this.props.closeDialog}> Cancel </Button>
                                <Button color="primary" disabled={this.addButtonIsDisable()} onClick={this.addOrder}> Add </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>
            </div>
        )
    }

}

export default OrderDialog

