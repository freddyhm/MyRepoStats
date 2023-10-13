const BaseApiError = require("./baseApiError");

class TooManyRequestError extends BaseApiError {
    constructor(message, status_code) {
        super(message);
        this.name = 'TooManyRequestError',
        this.message = message,
        this.status_code = status_code
    }
}

module.exports = TooManyRequestError;