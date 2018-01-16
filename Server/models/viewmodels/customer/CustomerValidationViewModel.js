const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');


module.exports = app => {
    return {
        validate: () => {
            return [                
                check('phone').exists().withMessage("phone can not be empty")
            ]
        },
        response: (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return { result: true, errors: errors.mapped(), respone: res.status(422).json({ errors: errors.mapped() }) };
            } else {
                return { result: false, errors: null };
            }
        }
    };
}