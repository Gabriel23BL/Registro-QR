export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}