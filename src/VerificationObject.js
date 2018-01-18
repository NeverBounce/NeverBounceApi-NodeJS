'use strict';

class VerificationObject {

    constructor (response) {
        this.response = response;
    }

    /**
     * Returns result
     * @returns {Object}
     */
    getResult() {
        return this.response.result;
    }

    /**
     * Returns text code
     * @returns {*}
     */
    getNumericResult() {
        return VerificationObject[this.getResult()];
    }

    /**
     * Returns true if result is of specified types
     * @param codes
     * @returns {boolean}
     */
    is(codes) {
        if(Array.isArray(codes)) {
            return (codes.indexOf(this.getResult()) > -1 || codes.indexOf(this.getNumericResult()) > -1);
        } else {
            return (codes === this.getResult() || codes === this.getNumericResult());
        }
    }

    /**
     * Returns true if result is NOT of specified types
     * @param codes
     * @returns {boolean}
     */
    not(codes) {
        if(Array.isArray(codes)) {
            return (codes.indexOf(this.getResult()) === -1 && codes.indexOf(this.getNumericResult()) === -1);
        } else {
            return (codes !== this.getResult() && codes !== this.getNumericResult());
        }
    }

    /**
     * Returns true if the flag was returned
     * @param flag
     * @returns {boolean}
     */
    hasFlag(flag) {
        return this.response
            && this.response.flags
            && this.response.flags.indexOf(flag) > -1;
    }
}

VerificationObject.valid = 0;
VerificationObject.invalid = 1;
VerificationObject.disposable = 2;
VerificationObject.catchall = 3;
VerificationObject.unknown = 4;

/**
 * @since 4.1.4
 */
VerificationObject.helpers = {

    // Numerically indexed
    [VerificationObject.valid]: 'valid',
    [VerificationObject.invalid]: 'invalid',
    [VerificationObject.disposable]: 'disposable',
    [VerificationObject.catchall]: 'catchall',
    [VerificationObject.unknown]: 'unknown',

    // Text indexed
    valid: VerificationObject.valid,
    invalid: VerificationObject.invalid,
    disposable: VerificationObject.disposable,
    catchall: VerificationObject.catchall,
    unknown: VerificationObject.unknown,

    flags: {
        has_dns: 'has_dns',
        has_dns_mx: 'has_dns_mx',
        bad_syntax: 'bad_syntax',
        free_email_host: 'free_email_host',
        profanity: 'profanity',
        role_account: 'role_account',
        disposable_email: 'disposable_email',
        government_host: 'government_host',
        academic_host: 'acedemic_host', // API returns the misspelling, kept for backwards compat
        military_host: 'military_host',
        international_host: 'international_host',
        squatter_host: 'squatter_host',
        spelling_mistake: 'spelling_mistake',
        bad_dns: 'bad_dns',
        temporary_dns_error: 'temporary_dns_error',
        connect_fails: 'connect_fails',
        accepts_all: 'accepts_all',
        contains_alias: 'contains_alias',
        contains_subdomain: 'contains_subdomain',
        smtp_connectable: 'smtp_connectable',
        spamtrap_network: 'spamtrap_network',
    }
};

/**
 * @deprecated 4.1.4 Will be removed in next minor release
 */
VerificationObject.numericCodes = {
    valid: VerificationObject.valid,
    invalid: VerificationObject.invalid,
    disposable: VerificationObject.disposable,
    catchall: VerificationObject.catchall,
    unknown: VerificationObject.unknown,
};

module.exports = VerificationObject;