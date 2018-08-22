import React, { Component } from 'react'
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl'
import { Redirect } from 'react-router-dom'
import 'mapbox-gl/dist/mapbox-gl.css'
import ReactLoading from 'react-loading'
import Axios from '../node_modules/axios'
import marker_logo from './assets/truck_marker.png'
import { Typography, Button } from '../node_modules/@material-ui/core';


/// MAP COMPONENT USING MAPGL REACT MODULE, PLEASE CHANGE THE MAPQUEST KEY AND MAPBOX_TOKEN BEFORE USING IT /////

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmRiaXBiaXAiLCJhIjoiY2pqeTN3ZjZxMjlweDNxbWgzbzQ0dTYydiJ9.i0MClAs3MYHtO3bEDBsb4w"
const MAPQUEST_KEY = "SDFJI2KM9ZUQqBXk95NxwHjajiAX4q1X"
const styles = {
    mapGL: {
    },
    marker: {
        height: "40px",
    },
    popupButton: {
        marginTop: "15px"
    }
}

const PopupMsg = props => (
    <div>
        <h4> Truck Information </h4>
        <Typography color="textSecondary"> {props.adress} </Typography>
        <Button size="small" style={styles.popupButton} onClick={props.redirect} > Assign order </Button>
        <Button size="small" style={styles.popupButton} onClick={props.closePopup}> Close </Button>
    </div>
)


class Map extends Component {
    constructor(props) {
        console.log(props)
        super(props)
        this.state = {
            viewport: {
                latitude: 46.571135,
                longitude: 2.790527,
                width: window.innerWidth * 0.75,
                height: window.innerHeight * 0.70,
                zoom: window.innerWidth > 800 ? 5 : 4
            },
            screenHeight: window.innerHeight,
            screenWidth: window.innerWidth,
            trucks: null,
            markersReady: false,
            popupInfo: null,
            popupAdress: null,
            redirect: false
        }
        this.getTrucksPos()
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this))
        this.resize()
        this.props.goToViewport && this.goToViewport(this.props.goToLat, this.props.goToLong, 5000, 10)
    }

    goToViewport = (lat, long, speed, zoom) => {
        const viewport = {
            ...this.state.viewport,
            latitude: lat,
            longitude: long,
            zoom: zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: speed
        }
        this.setState({ viewport })

    }

    redirectToOrders = () => {
        this.setState({ redirect: true })
    }

    closePopup = () => this.setState({ popupInfo: null, popupAdress: null })

    resize() {
        this.setState({
            viewport: {
                ...this.state.viewport,
                height: window.innerHeight * 0.70,
                width: window.innerWidth * 0.75
            }
        })
    }

    getTrucksPos = () => {
        console.log("truck pos call")
        const url = `http://localhost:8080/api/trucks/position?sid=${this.props.sid}`
        Axios.get(url)
            .then(res => {
                var trucks = res.data.map(truck => (
                    {
                        id: truck.vehicleId[0].id[0],
                        lat: parseFloat(truck.latitude[0].value[0]),
                        long: parseFloat(truck.longitude[0].value[0])
                    }
                ))
                this.setState({
                    markersReady: true,
                    trucks: trucks
                })
            })
            .catch(err => {
                console.error(err)
            })
    }

    handlePopupClick = (evt, lat, long, vehicleId) => {
        evt.preventDefault()
        const popupInfo = {
            lat: lat,
            long: long,
            id: vehicleId
        }
        const actualZoom = this.state.viewport.zoom
        this.goToViewport(lat, long, 500, actualZoom)
        this.setState({ popupInfo, popupAdress: null })
        const url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${MAPQUEST_KEY}&location=${popupInfo.lat}%2C${popupInfo.long}&outFormat=json&thumbMaps=false`
        Axios.get(url)
            .then(res => {
                const data = res.data.results[0].locations[0]
                const popupAdress = `${data.adminArea1} - ${data.street} , ${data.postalCode} ${data.adminArea5}`
                this.setState({ popupAdress })
            })
            .catch(err => {
                console.error("Catch error MapQuest API")
                console.error(err)
            })


    }

    renderMarker = (truck, idx) => {
        const size = 30;
        return (
            <Marker
                key={idx}
                latitude={truck.lat}
                longitude={truck.long}
            >
                <img onClick={evt => this.handlePopupClick(evt, truck.lat, truck.long, truck.id)} style={{ height: size, transform: `translate(${-size / 2}px, ${-size}px)` }} alt="truck_marker" src={marker_logo} />
            </Marker>
        )
    }

    renderPopup = () => {
        const { popupInfo } = this.state
        return popupInfo && (
            <Popup tipSize={5}
                anchor='top'
                longitude={popupInfo.long}
                latitude={popupInfo.lat}
                onClose={() => this.setState({ popupInfo: null, popupAdress: null })}
            >
                {this.state.popupAdress ? <PopupMsg adress={this.state.popupAdress} closePopup={this.closePopup} vehicleId={popupInfo.id} redirect={this.redirectToOrders} /> : <ReactLoading style={{ height: "20px", width: "20px" }} type="balls" color="rgb(0,0,100)" />}
            </Popup>
        )
    }

    render() {
        if (this.state.redirect) return (<Redirect to={{ pathname: '/orders', state: { dialogOpen: true, vehicleId: this.state.popupInfo.id } }} />)
        return (
            <ReactMapGL
                {...this.state.viewport}
                style={styles.mapGL}
                mapStyle='mapbox://styles/mapbox/streets-v9'
                onViewportChange={viewport => this.setState({ viewport })}
                mapboxApiAccessToken={MAPBOX_TOKEN} >
                {this.state.markersReady && this.state.trucks.map((truck, idx) => this.renderMarker(truck, idx))}
                {this.renderPopup()
                }
            </ ReactMapGL>
        )
    }

}

export default Map