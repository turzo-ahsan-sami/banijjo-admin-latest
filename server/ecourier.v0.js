const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { query } = require('../db_config')



const {
    ecourierBaseUrl,
    ecourierHeaders,
    ecourierPlaceOrderBody
} = require('./ecourierHelpers')

// test
router.get('/', async (req, res) => {
    res.send('ecourier api')
})




// Place order
router.post('/order-place', async (req, res) => {

    try {
        const packages = await getPackages()
        const packageCode = await getPackageCode(packages, req)

        const url = await ecourierBaseUrl()
        const headers = await ecourierHeaders()
        const body = await ecourierPlaceOrderBody(req, packageCode)


        fetch(`${url}/order-place`, {
            method: 'POST',
            crossDomain: true,
            headers: { headers },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                const { message, ID } = data
                saveOrderInfo(ID)
                res.send(message)
            })
            .catch(err => {
                res.send(err)
            })
    } catch (err) {
        res.send(err)
    }
});

const getPackages = async () => {
    fetch(`${url}/packages`, {
        method: 'POST',
        crossDomain: true,
        headers: { headers },
        body: {}
    })
        .then(res => res.json())
        .then(data => { return data })
        .catch(err => { res.send(err) })
}

const getPackageCode = async (packages, req) => {
    const { weight, quantity, deliveryLocation, deliveryTime } = req.body.specification
    if (deliveryLocation) packages = packages.filter(package => package.coverage === deliveryLocation)
    if (deliveryTime) packages = packages.filter(package => package.deliveryTime === deliveryLocation)
    if (weight) packages = packages.filter(package => {
        package.weightrange.split('-')[0] <= weight * quantity
            && package.weightrange.split('-')[1] >= weight * quantity
    })

    if (!packages) {
        res.send("Could not find a suitable package");
        return
    }
    return packages[0].package_code
}

const saveOrderInfo = async (ID) => {
    try {
        return await query(
            `INSERT INTO order 
            (courier_service_id, courier_order_code) VALUES (1, ${ID})`
        );
    } catch (err) {
        res.send(err)
        return
    }
}


//  Parcel track
router.post('/track', async (req, res) => {

    const url = ecourierBaseUrl()
    const headers = ecourierHeaders()
    const body = ecourierParcelTrackBody()

    fetch(`${url}/track`, {
        method: 'POST',
        crossDomain: true,
        headers: { headers },
        body: JSON.stringify(body)
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
});



//  Package list
router.get('/packages', async (req, res) => {

    const url = await ecourierBaseUrl()
    const headers = await ecourierHeaders()

    fetch(`${url}/packages`, {
            method : 'POST',
            crossDomain : true,
            headers : { headers },
            body : { }
    })
    .then(res => res.json())
    .then(data => { res.send(data) })
    .catch(err => { res.send(err) })
});



//  Cancel Order
router.post('/cancel-order', async (req, res) => {

    const url = ecourierBaseUrl()
    const headers = ecourierHeaders()
    const body = ecourierCancelOrderBody()

    fetch(`${url}/cancel-order`, {
        method: 'POST',
        crossDomain: true,
        headers: { headers },
        body: JSON.stringify(body)
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
});


//  Fraud alert service 
router.post('/fraud-status-check', async (req, res) => {

    const url = ecourierBaseUrl()
    const headers = ecourierHeaders()

    fetch(`${url}/fraud-status-check`, {
        method: 'POST',
        crossDomain: true,
        headers: { headers },
        body: {
            "number": req.body.number // Customer mobile number
        }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
});





//  City list
router.post('/citylist', async (req, res) => {

    const url = ecourierBaseUrl()
    const headers = ecourierHeaders()

    fetch(`${url}/city-list`, {
        method: 'POST',
        crossDomain: true,
        headers: { headers },
        body: {  }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
});







module.exports = router