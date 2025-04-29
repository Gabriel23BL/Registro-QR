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
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};


export const authenticateJWTLogin = (req, res, next) => {
    req.cookies.jwt ? res.redirect('/') : next();
};


export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.direct('/')
        }
        next();
    };
};