const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if(token) {
            token = token.slice(7); // Token structure bearer (6 + 1 for space) + token characters (the only part needed) 
            verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if(error) {
                    res.json({message: 'Invalid Token!'})
                } else {
                    next();
                };

            });
        } else {
            res.json({message: 'Access denied! Unauthorized user!'});
        }
    }
}