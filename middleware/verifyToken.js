const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if(token) {
            token = token.split(' ')[1]; // Splits to 'Bearer' and 'Token code' (by a space between) and gets only the token code (index 1) 
            verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if(error) {
                    res.status(403).json({message: 'Invalid Token!'})
                } else {
                    next();
                };

            });
        } else {
            res.json({message: 'Access denied! Unauthorized user!'});
        }
    }
}