const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        const tokenHeader = req.headers.authorization;
        if(!tokenHeader) return res.status(401).json({message: 'Unauthorized Request'});

        const token = tokenHeader.split(' ')[1];
        if(!token) return res.status(401).json({message: 'Unauthorized Request'});
        if(!token.length) return res.status(401).json({message: 'Unauthrorized Request'});

        verify(token, process.env.JWT_SECRET, (error, payload) => {
            if(error) return res.status(401).json({message: 'Unauthorized Request'});
            req.user = payload.subject;
            next();
        })
    }

}