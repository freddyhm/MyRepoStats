class BaseApiError extends Error {
    constructor(message, status_code) {
        super(message);
        this.name = 'ApiError',
        this.message = message,
        this.status_code = status_code
    }
}

module.exports = BaseApiError;