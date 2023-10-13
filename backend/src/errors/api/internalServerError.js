const BaseApiError = require("./baseApiError");

class InternalServerError extends BaseApiError {
    constructor(message, status_code) {
        super(message);
        this.name = 'InternalServerError',
        this.message = message,
        this.status_code = status_code
    }
}

module.exports = InternalServerError;