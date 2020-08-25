const { query } = require("../db_config")


const api_key = "BDNP"
const api_secret = "KGRgp"
const user_id = "I6017"

const sandbox = true

const sandbox_url = "https://staging.ecourier.com.bd/api/"
const production_url = "https://ecourier.com.bd/apiv2/"


// const eCourierInfo = async() => {
//     try{
//         return await query(`
//             SELECT 
//               * 
//             FROM 
//                 courier-services
//             WHERE 
//               id = 1
//         `)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// }

// const api_key = eCourierInfo.api_key
// const api_secret = eCourierInfo.api_secret
// const user_id = eCourierInfo.user_id
// const sandbox_url = eCourierInfo.sandbox_url
// const production_url = eCourierInfo.production_url

// const sandbox = true



module.exports.ecourierBaseUrl = async() => {
    return sandbox ? sandbox_url : production_url
}

module.exports.ecourierHeaders = async() => {
    return {
        'API-KEY' : api_key,
        'API-SECRET' : api_secret,
        'USER-ID' : user_id,
        'Content-Type' : 'application/json'
    }
}

module.exports.ecourierPlaceOrderBody = async(req, packageCode) => {
    return {
        "recipient_name" : req.body.recipient_name,
        "recipient_mobile" : req.body.recipient_mobile,
        "recipient_city" : req.body.recipient_city,
        "recipient_area" : req.body.recipient_area,
        "recipient_address" : req.body.recipient_address,
        "package_code" : packageCode,
        "product_price" : req.body.product_price,
        "payment_method" : req.body.payment_method,
        "recipient_landmark" : req.body.recipient_landmark,
        "parcel_type" : req.body.parcel_type,
        "is_anonymous" : req.body.is_anonymous,
        "requested_delivery_time" : req.body.requested_delivery_time,
        "delivery_hour" : req.body.delivery_hour,
        "recipient_zip" : req.body.recipient_zip,
        "product_id" : req.body.product_id,
        "pick_address" : req.body.pick_address,
        "comments" : req.body.comments,
        "number_of_item" : req.body.number_of_item,
        "actual_product_price" : req.body.actual_product_price
    }
}


module.exports.ecourierParcelTrackBody = (req) => {
    return {
        "product_id" : req.body.product_id,
        "ecr" : req.body.ecr //  eCourier ID
    }
}

module.exports.ecourierCancelOrderBody = (req) => {
    return {
        "tracking" : req.body.tracking, //  eCourier ID
        "comment" : req.body.comment
    }
}



module.exports.ecourierPackages = async() => {

    const url = ecourierBaseUrl()
    const headers = ecourierHeaders()

    fetch(`${url}/packages`, {
            method : 'POST',
            crossDomain : true,
            headers : { headers },
            body : { }
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        return data;
    })
    .catch(err => {
        res.send(err)
    })
};




