export const AUTH_COMMAND = {
    AUTHENTICATE: "auth_authenticate",
    VALIDATE_TOKEN: "auth_validateToken",
    REFRESH_TOKEN: "auth_refreshToken"
}

export const CHURCH_COMMAND = {
    CREATE_CHURCH: 'create_church',
    CREATE_CHURCH_CAMPUS: 'create_church_campus',
    GET_CHURCHES: 'get_churches',
    GET_CHURCH_BY_ID: 'get_church_by_id',
    GET_CHURCH_CAMPUSES: 'get_church_campuses',
    GET_CHURCH_CAMPUS_BY_ID: 'get_church_campus_by_id',
    UPDATE_CHURCH_CAMPUS: 'update_church_campus',
    DELETE_CHURCH_CAMPUS: 'delete_church_campus',
}


export const ORDER_COMMAND = {
    GET_ORDER: 'get_order',
}

export const STORE_COMMAND = {
    GET_STORE: 'get_store',
}