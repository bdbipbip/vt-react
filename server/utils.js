var xml2js = require('xml2js');
var HttpsProxyAgent = require('https-proxy-agent');
var exports = module.exports = {}

/// CONTAINS ALL THE METHODS USED IN ROUTES, LIKE CREATE SOAP TO CREATE A SPECIFIC REQUEST FOR THE 
/// VOLVO SOAP API, ALL THOSE METHODS ARE DEDICATED TO BE USE WITH THE VOLVO SOAP API ///

//SETUP PROXY 
const proxy = exports.proxy = process.env.VOLVO_HTTP_PROXY

exports.treatXmlResult = async (xml, isSpecial) => {
    var xmlParser = new xml2js.Parser();
    return new Promise((resolve, reject) => {
        xmlParser.parseString(xml, (err, jsonTrucksPos) => {
            if (!err) {
                let finalRes;
                var preTreated = jsonTrucksPos["soap:Envelope"]["soap:Body"][0];
                for (var key in preTreated) {
                    if (preTreated.hasOwnProperty(key)) {
                        finalRes = isSpecial ? preTreated[key][0] : preTreated[key][0].result[0];
                    }
                }
                resolve(finalRes);
            } else {
                console.log("TREAT XML ERROR")
                reject(err);
            }
        })
    })
}

exports.createApiOrder = (orderId, customerId, customerRef, orderItem) => {
    return (
        {
            "assignedUserId": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "assignedVehicleId": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "completedTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "createTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "customerDescription": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "customerId": {
                "value": customerId
            },
            "deletedTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "driverDescription": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "driverId": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "isRead": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "lastModifyTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "orderCustomerRef": customerRef,
            "orderItems": orderItem,
            "orderNumber": orderId,
            "userDescription": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "vehicleDescription": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            }
        }
    )
}

exports.createApiOrderItem = (activity, formFields, plannedFrom, plannedTo, poiId, templateId, orderItemNumber) => {
    return (
        {
            "activityType": activity,
            "completionTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "createTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "deletedTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "lastModifyTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "lastSendStatusTime": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "orderFormFields": formFields[0],
            "orderFormFields": formFields[1],
            "orderItemNumber": {
                "value": orderItemNumber
            },
            "orderNumber": {
                $: {
                    "xsi:nil": "true",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            },
            "plannedFrom": {
                "value": plannedFrom
            },
            "plannedTo": {
                "value": plannedTo
            },
            "templateId": {
                "id": templateId
            }
        }
    )
}

exports.createSoap = async (url, type, data) => {
    var xmlBuilder = new xml2js.Builder();
    //var proxy = 'http://pxgot4.srv.volvo.com:8080';
    console.log(proxy)
    var agent = new HttpsProxyAgent(proxy);
    const typ = `typ:${type}`
    const datas = {
        'soapenv:Envelope': {
            $: {
                "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                "xmlns:typ": "http://wirelesscar.com/dynafleet/api/types"
            },
            'soapenv:Header': {},
            'soapenv:Body': {}
        }
    };
    datas['soapenv:Envelope']['soapenv:Body'][typ] = data
    return new Promise((resolve, reject) => {
        const xmlDatas = xmlBuilder.buildObject(datas);
        if (!xmlDatas) reject("Can't parse into XML")
        resolve({
            uri: url,
            method: "POST",
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': ''
            },
            agent: agent,
            body: xmlDatas
        });
    })



}
