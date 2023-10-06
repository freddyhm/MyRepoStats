class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError'
    }
}

class Validator {
    static validateInput(username, reponame, timezone) {
        Validator.validateUsenameReponame(username, reponame);
        Validator.validateTimezone(timezone);
    }

    static validateUsenameReponame(username, reponame) {
        
        const nameValidator = /^[a-zA-Z0-9_-]+$/;

        if (!nameValidator.test(username) || !nameValidator.test(reponame)) {
            console.log("not valid");
            throw new ValidationError("Username or repo name are not valid");
        }
    }

    static validateTimezone(timezone) {
        const validTimezones = ["America/Montreal", "America/Vancouver"];

        if (!validTimezones.includes(timezone)) {
            throw new ValidationError("Timezone is not valid");
        }
    }
}

module.exports = Validator;