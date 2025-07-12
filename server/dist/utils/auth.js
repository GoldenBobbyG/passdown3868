import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';
export const authenticateToken = ({ req }) => {
    // Allow token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }
    if (!token) {
        return { user: null };
    }
    // Verify token and get user info out of it
    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        return { user: data };
    }
    catch {
        console.log('Invalid token');
        return { user: null };
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
export class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}
;
