var request = require('request');
var rp = require('request-promise');
var utils = require('./utils.js')
var xml2js = require('xml2js');
var HttpsProxyAgent = require('https-proxy-agent');
var express = require('express');
var app = express();


// REPRESENTS ALL THE ROUTES FOR THE APP 

//login
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let typ = "login"
    var url = 'https://api2.dynafleetonline.com/ports/Login'
    const datas = {
        "Api_LoginLoginTO_1": {
            gmtOffset: {
                value: 1
            },
            password: password,
            username: username
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    try {
        const result = await rp(rq)
        if (!result) return res.send(408, "Cant login")
        const jsonRes = await utils.treatXmlResult(result, false)
        if (!jsonRes) return res.send("Cant parse response, wrong credentials")
        const sid = jsonRes.id[0]
        return res.send(sid)
    } catch (error) {
        console.log("LOGIN CATCH ERROR")
        console.error(error.message)
        return res.send(408, error)
    }
});

app.get('/trucks', async (req, res) => {
    const sid = req.query.sid;
    var xmlBuilder = new xml2js.Builder();
    var agent = new HttpsProxyAgent(utils.proxy);
    var url = 'https://api2.dynafleetonline.com/ports/VehicleAndDriverAdmin'
    const datas = {
        'soapenv:Envelope': {
            $: {
                "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                "xmlns:typ": "http://wirelesscar.com/dynafleet/api/types"
            },
            'soapenv:Header': {},
            'soapenv:Body': {
                "typ:getVehiclesV2": {
                    "Api_SessionId_1": {
                        "id": sid
                    }
                }
            }
        }
    };
    const xmlDatas = xmlBuilder.buildObject(datas);
    var options = {
        uri: url,
        method: "POST",
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': ''
        },
        agent: agent,
        body: xmlDatas
    }
    try {
        console.log("try request")
        const xmlTrucks = await rp(options);
        console.log("Trucks ok")
        if (!xmlTrucks) res.send(408, "no trucks returned")
        var xmlParser = new xml2js.Parser();
        xmlParser.parseString(xmlTrucks, (err, jsonTrucks) => {
            if (!err) {
                let finalRes;
                var preTreated = jsonTrucks["soap:Envelope"]["soap:Body"][0];
                for (var key in preTreated) {
                    if (preTreated.hasOwnProperty(key)) {
                        finalRes = preTreated[key][0].result;
                    }
                }
                const trucks = finalRes[0].vehicleInfos;
                return res.json(trucks);
            } else { console.log("err"); }
        })
    } catch (e) {
        console.log("Error catched while getting trucks")
        //console.log(e.message)
        res.status(408).send("Can't get trucks")
    }
})

app.get('/trucks/position', async (req, res) => {
    const sid = req.query.sid;
    var xmlBuilder = new xml2js.Builder();
    var agent = new HttpsProxyAgent(utils.proxy);
    var url = 'https://api2.dynafleetonline.com/ports/Tracking'
    const datas = {
        'soapenv:Envelope': {
            $: {
                "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                "xmlns:typ": "http://wirelesscar.com/dynafleet/api/types"
            },
            'soapenv:Header': {},
            'soapenv:Body': {
                "typ:getLastKnownPositions": {
                    "Api_SessionId_1": {
                        "id": sid
                    }
                }
            }
        }
    };
    const xmlDatas = xmlBuilder.buildObject(datas);
    var options = {
        uri: url,
        method: "POST",
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': ''
        },
        agent: agent,
        body: xmlDatas
    }
    try {
        const xmlTrucksPos = await rp(options);
        if (!xmlTrucksPos) res.send(408, "no trucks returned")
        var xmlParser = new xml2js.Parser();
        xmlParser.parseString(xmlTrucksPos, (err, jsonTrucksPos) => {
            if (!err) {
                let finalRes;
                var preTreated = jsonTrucksPos["soap:Envelope"]["soap:Body"][0];
                for (var key in preTreated) {
                    if (preTreated.hasOwnProperty(key)) {
                        finalRes = preTreated[key][0];
                    }
                }
                const trucksPos = finalRes["lastKnownPositions"][0]["array"]
                return res.json(trucksPos);
            } else { console.log("err"); }
        })
    } catch (e) {
        console.log("Catch error : Truck position")
        res.status(408).send("Cant get truck pos")
    }
})

app.get('/truck/:vehicleId', async (req, res) => {
    const vehicleId = req.params.vehicleId
    const sid = req.query.sid;
    var xmlBuilder = new xml2js.Builder();
    var agent = new HttpsProxyAgent(utils.proxy);
    var url = 'https://api2.dynafleetonline.com/ports/Tracking'
    const datas = {
        'soapenv:Envelope': {
            $: {
                "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                "xmlns:typ": "http://wirelesscar.com/dynafleet/api/types"
            },
            'soapenv:Header': {},
            'soapenv:Body': {
                "typ:getVehiclePositions": {
                    "Api_TrackingGetVehiclePositionTO_1": {
                        "numberOfPositions": {
                            "value": 1
                        },
                        "sessionId": {
                            "id": sid
                        },
                        "vehicleId": {
                            "id": vehicleId
                        }
                    }
                }
            }
        }
    };
    const xmlDatas = xmlBuilder.buildObject(datas);
    var options = {
        uri: url,
        method: "POST",
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': ''
        },
        agent: agent,
        body: xmlDatas
    }
    try {
        const xmlTruckInfos = await rp(options)
        if (!xmlTruckInfos) return res.send(408, "no trucks returned")
        var xmlParser = new xml2js.Parser();
        xmlParser.parseString(xmlTruckInfos, (err, jsonTruckInfos) => {
            if (!err) {
                let finalRes;
                var preTreated = jsonTruckInfos["soap:Envelope"]["soap:Body"][0];
                for (var key in preTreated) {
                    if (preTreated.hasOwnProperty(key)) {
                        finalRes = preTreated[key][0].result;
                    }
                }
                const truckInfos = {
                    lat: finalRes[0].array[0].latitude[0].value[0],
                    long: finalRes[0].array[0].longitude[0].value[0]
                };
                return res.json(truckInfos);
            } else { console.log("err"); }
        })
    } catch (e) {
        console.log("ERROR REQUEST GET TRUCK INFO")
        res.status(408)
    }

})

app.post('/orders', async (req, res) => {
    console.log("ADD ORDER CALL")
    const sid = req.query.sid;
    let orderId = req.body.orderId
    const customerId = req.body.customerId
    const customerRef = req.body.customerRef
    const vehicleId = req.body.vehicleId
    let retry = true
    let isOrderAdded
    var tmpOrderId = orderId
    while (retry) {
        try {
            isOrderAdded = await tryToAddOrder(sid, tmpOrderId, customerId, customerRef)
            if (isOrderAdded) {
                console.log("ASSIGN ORDER")
                isOrderAssigned = await assignOrder(sid, tmpOrderId, vehicleId)
                if (isOrderAssigned) {
                    retry = false
                    return res.send(200, "order added and assigned and send")
                }
            }
        } catch (error) {
            console.log("Catch error : ADD ORDER")
            if (error.toString().includes("already exists")) {
                console.log("ORDER ID ALREADY EXIST")
                typeof (tmpOrderId) === "string" ? tmpOrderId = parseInt(tmpOrderId) + 1 : tmpOrderId += 1
            } else {
                retry = false
                return res.send(408, "error while adding order")
            }
        }
    }
    return res.send(200, "order added and assigned")


})

const assignOrder = async (sid, orderId, vehicleId) => {
    let typ = "assignOrderToVehicle"
    var url = 'https://api2.dynafleetonline.com/ports/Order'
    const datas = {
        "Api_OrderAssignOrderToVehicleTO_1": {
            "orderNumber": orderId,
            "sessionId": {
                "id": sid
            },
            "vehicleId": {
                "id": vehicleId
            }
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    console.log("try to assign order #" + orderId)
    const xmlResult = await rp(rq)
    if (xmlResult) return true
    else return false
}

// NOT USE 
const sendOrderToVehicle = async (sid, orderId) => {
    let typ = "sendOrderToVehicle"
    var url = 'https://api2.dynafleetonline.com/ports/Order'
    const apiOrder = createApiOrder(orderId, customerId, customerRef)
    const datas = {
        "Api_OrderSendOrderToVehicleTO_1": {
            "orderNumber": orderId,
            "sessionId": {
                "id": sid
            }
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    console.log("try to send order #" + orderId)
    const xmlResult = await rp(rq)
    sendOrderResult = await utils.treatXmlResult(xmlResult, false)
    if (sendOrderResult) return true
    else return false
}

const tryToAddOrder = async (sid, orderId, customerId, customerRef) => {
    let typ = "storeNewOrder"
    var url = 'https://api2.dynafleetonline.com/ports/Order'
    const apiOrder = utils.createApiOrder(orderId, customerId, customerRef)
    const datas = {
        "Api_OrderStoreNewOrderTO_1": {
            "apiOrder": apiOrder,
            "sessionId": {
                "id": sid
            }
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    console.log("try to add order #" + orderId)
    const xmlResult = await rp(rq)
    addOrderResult = await utils.treatXmlResult(xmlResult, false)
    if (addOrderResult) return true
    else return false
}

app.delete('/orders/:orderId', async (req, res) => {
    console.log("DELETE ORDER CALL")
    const sid = req.query.sid
    const orderId = req.params.orderId
    console.log(orderId)
    let typ = "markOrderAsCompleted"
    let url = "https://api2.dynafleetonline.com/ports/Order"
    const subDatas = {
        "orderNumber": orderId,
        "sessionId": {
            "id": sid
        }
    }
    let datas = {
        "Api_OrderMarkOrderAsCompletedTO_1": subDatas
    }
    let rq = await utils.createSoap(url, typ, datas)
    try {
        let xmlRes = await rp(rq)
        if (!xmlRes) return res.send(408, "unable to mark order as completed")
        typ = "deleteCompletedOrder"
        datas = {
            "Api_OrderDeleteCompletedOrderTO_1": subDatas
        }
        rq = await utils.createSoap(url, typ, datas)
        xmlRes = await rp(rq)
        if (!xmlRes) return res.send(408, "unable to delete this order")
        return res.send(200, "order deleted")
    } catch (error) {
        console.log("Get delete order error")
        console.log(error.message)
        return res.send(410, "cant handle delete order")
    }
})

app.get('/customers', async (req, res) => {
    console.log("GET CUSTOMER CALL")
    const sid = req.query.sid;
    let typ = "getCustomers"
    var url = 'https://api2.dynafleetonline.com/ports/TransportCustomer'
    const datas = {
        "Api_SessionId_1": {
            "id": sid
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    try {
        const xmlCustomers = await rp(rq)
        if (!xmlCustomers) return res.send(408, "Cant request customers")
        customers = await utils.treatXmlResult(xmlCustomers, false)
        customers = customers["array"]
        customersRes = []
        for (var idx in customers) {
            const id = customers[idx]['customerId'][0]["id"][0]
            const name = customers[idx]['name'][0]
            const customer = {
                [id]: name
            }
            customersRes.push(customer)
        }
        return res.send(200, customersRes)
    } catch (error) {
        console.log("CUSTOMER DIALOG NOT OK --------------------------------------")
        // console.log(error)
        return res.send(408, "cant get all customers")
    }
})

app.get('/orders', async (req, res) => {
    console.log("GET ORDERS CALL")
    const sid = req.query.sid;
    console.log("sessionId :", sid)
    let typ = "getCustomers"
    var url = 'https://api2.dynafleetonline.com/ports/TransportCustomer'
    const datas = {
        "Api_SessionId_1": {
            "id": sid
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    try {
        const result = await rp(rq)
        if (!result) return res.send(408, "Cant request customers")
        customers = await utils.treatXmlResult(result, false)
        customers = customers["array"]
        url = 'https://api2.dynafleetonline.com/ports/Order'
        typ = "getCustomerOrders"
        let ordersResult = []
        let rqs = []
        for (var idx in customers) {
            const id = customers[idx]['customerId'][0]["id"][0]
            var now = new Date()
            var d = new Date()
            for (d.setDate(d.getDate() - 4); d <= now; d.setDate(d.getDate() + 2)) {
                var tmpDate = new Date(d)
                tmpDate.setDate(tmpDate.getDate() + 2)
                const datas = {
                    Api_OrderGetCustomerOrdersTO_1: {
                        "customerId": {
                            "id": id
                        },
                        "fromDate": {
                            "value": d.toISOString()
                        },
                        "sessionId": {
                            "id": sid
                        },
                        "toDate": {
                            "value": tmpDate.toISOString()
                        }
                    }
                }
                const request = await utils.createSoap(url, typ, datas)
                let newRq = new Promise((resolve, reject) => {
                    return rp(request)
                        .then(res => {
                            return utils.treatXmlResult(res, false)
                                .then(json => resolve(json["array"]))
                        })
                        .catch(err => {
                            console.log("One request fail")
                            reject(err)
                        })
                })
                rqs.push(newRq)
            }
        }
        return Promise.all(rqs)
            .then(result => {
                result.filter(orders => orders && true)
                    .map(orders => ordersResult.push.apply(ordersResult, orders))
                return res.send(ordersResult)
            })
            .catch(err => {
                console.log("ERROR PROMISE ALL")
                //console.log(err.message)
                //if (err.message.includes("invalidSessionId")) return res.send(410, "logout")
                return res.send(err)
            })
    }
    catch (error) {
        console.log("CUSTOMERS ERROR")
        //console.log(error.message)
        //if (error.message.includes("invalidSessionId")) return res.send(410, "logout")
        return res.send(error)
    }
})

app.get('/poi', async (req, res) => {
    const sid = req.query.sid;
    let typ = "getPois"
    var url = 'https://api2.dynafleetonline.com/ports/Poi'
    const datas = {
        "Api_SessionId_1": {
            "id": sid
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    try {
        const xmlRes = await rp(rq)
        let jsonRes = await utils.treatXmlResult(xmlRes, false)
        jsonRes = jsonRes["array"]
        const result = jsonRes.map(poi => {
            const id = poi.poiId[0].id[0]
            const name = poi.displayName[0]
            return {
                [id]: name
            }
        })
        return res.send(200, result)
    } catch (error) {
        console.log("Catch error : GET POIS")
        console.log(error.message)
        return res.send(404, "cant get all pois")
    }
})

app.get('/forms', async (req, res) => {
    const sid = req.query.sid;
    let typ = "getForms"
    var url = 'https://api2.dynafleetonline.com/ports/Form'
    const datas = {
        "Api_SessionId_1": {
            "id": sid
        }
    }
    const rq = await utils.createSoap(url, typ, datas)
    try {
        const xmlRes = await rp(rq)
        let jsonRes = await utils.treatXmlResult(xmlRes, false)
        jsonRes = jsonRes["array"]
        const result = jsonRes.map(form => {
            const id = form.formId[0].id[0]
            const name = form.displayName[0]
            return {
                [id]: name
            }
        })
        return res.send(200, result)
    } catch (error) {
        console.log("Catch error : GET FORM")
        // console.log(error)
        return res.send(404, "cant get all forms")
    }
})


module.exports = app;