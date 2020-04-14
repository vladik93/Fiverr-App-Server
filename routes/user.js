const { authJwt } = require('../middlewares');
const controller = require('../controllers/user.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/role/user', [authJwt.verifyToken], controller.userBoard);

    app.get('/api/role/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
}