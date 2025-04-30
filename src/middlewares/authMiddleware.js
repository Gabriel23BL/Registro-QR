import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie('jwt');
            return res.redirect('/login');
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.clearCookie('jwt');
            return res.redirect('/login');
        }

        console.error('Error de autenticación:', error);
        res.redirect('/login');
    }
};

export const authenticateJWTLogin = (req, res, next) => {
    req.cookies.jwt ? res.redirect('/') : next();
};

export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.redirect('/')
        }
        next();
    };
};