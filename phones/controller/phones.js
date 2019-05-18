const Phone = require('../model/Phone');

/*
 * Create new phone
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.create = async (req, res) => {
    try {
       
        if (!req.body.name ||
            !req.body.description ||
            !req.body.imageurl ||
            !req.body.price ) {
                throw {
                    code: 'BRP',
                    message: 'Bad request params'
                }
        }
        const phone = new Phone({
            name: req.body.name,
            description: req.body.description,
            imageurl: req.body.imageurl,
            price: req.body.price
        })

        await phone.save();

        return res.status(200).send({phone})
    } catch (err) {
        return handler(err, req, res);
    }
};

/**
 * FindAll
 * Retrieve and return all phone
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
    try {
        if (!req.query.page) {
            throw {
                code: 'BRP',
                message: 'Bad request params. Needs page in query param'
            }
        }
        const phones = await Phone.find();
        const pageCount = Math.ceil(phones.length / 10)
        let page = parseInt(req.query.page)
        if (!page) page = 1
        if (page > pageCount) {
            page = pageCount
        }
        res.json({
            'page': page,
            'total': phones.length,
            'pageCount': pageCount,
            'phones': phones.slice(page * 10 - 10, page * 10)
        })
    } catch (err) {
        console.log('findAll %s', err)
        return handler(err, req, res);
    }
};
/**
 * getPrices
 * Retrieve prices of phones from array of phones
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getPrices = async (req, res) => {
    try {
        if (!req.body.phones) {
            throw {
                code: 'BRP',
                message: 'Bad request params. Needs a phones list'
            }
        }
       
        const phones = req.body.phones;
 
        const _phones = await Promise.all(phones.map(async (elem) => {
            let _phone = await Phone.findOne({name: elem})
            let phone = {
                name: elem,
              
             };

            if(_phone){
                phone = {
                    name: _phone.name,
                    price: _phone.price
                }
            }
            
            
            return phone
        }));
        const phonesFilter = _phones.filter(phone => phone.price > 0)
        return res.status(200).send({phones: phonesFilter})
    } catch (err) {
        console.log('findAll %s', err)
        return handler(err, req, res);
    }
};

/**
 * Handler
 * Error handler
 * @param {*} err
 * @param {*} res
 * @returns code: err
 */
function handler(err, req, res) {
   

    if (err) {
        if (err.message) {
            return res.status(500).send({
                code: err.code,
                message: err.message
            });
        } else {
            return res.status(500).send({
                code: err
            });
        }
    }

    return res.status(500).send({
        code: "500",
        message: "Internal Server error"
    });
}