
export const FORM_CONST = {
    EMAIL_REGEX: new RegExp('^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))' +
    '@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'),
     WEBSITE_REGEX: new RegExp('^(https?:\\/\\/)?(?:www\\.)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(\\.[a-zA-Z]{2,})+$'),

    // GENERAL_COURSE_CERTIFICATE_NUMBER_REGEX: new RegExp('^[AG][NQ]\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])(BW|B|G|L|M|MO|MU|N|S|W)-\\d{1,5}$'),
    GENERAL_COURSE_CERTIFICATE_NUMBER_REGEX: new RegExp('^[AG][NQ]\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])(BW|B|G|L|M|MO|MM|MU|N|S|W)-\\d{1,5}$', 'i'),
    COURSE_DIRECTOR_AUTHORIZATION_CODE_REGEX: new RegExp('^A[NQ](\\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])-(\\d{2})$', 'i')
}

export const ICON_CONSTANTS = {
    TAG: 'fa fa-tags',
    GAVEL: 'fa fa-gavel',
    USERS: 'fa fa-users' 
}

export const CONST = {
    ACCESS_TOKEN: "ACCESS_TOKENS",
    EXPIRATION: "EXPIRATION",
    AUTHENTICATED_USER: "AUTHENTICATED_USER",
}

