import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    console.log(req);
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Forbidden',
            })
        }
        req.userId = decoded.id
        next()
    })
}

export default auth