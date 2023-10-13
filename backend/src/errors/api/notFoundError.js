const BaseApiError = require("./baseApiError");

class NotFoundError extends BaseApiError {
    constructor(message, status_code) {
        super(message);
        this.name = 'NotFoundError',
        this.message = message,
        this.status_code = status_code
    }
}

module.exports = NotFoundError; 