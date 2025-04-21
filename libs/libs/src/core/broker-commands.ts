export const AUTH_COMMAND = {
    AUTHENTICATE: "auth_authenticate",
    VALIDATE_TOKEN: "auth_validateToken",
    REFRESH_TOKEN: "auth_refreshToken"
}

export const CHURCH_COMMAND = {
    CREATE_CHURCH: 'create_church',
    CREATE_CHURCH_CAMPUS: 'create_church_campus',
    CREATE_CHURCH_CAMPUS_STAFF: 'create_church_campus_staff',
    GET_CHURCHES: 'get_churches',
    GET_CHURCH_BY_ID: 'get_church_by_id',
    GET_CHURCH_CAMPUSES: 'get_church_campuses',
    GET_CHURCH_CAMPUS_BY_ID: 'get_church_campus_by_id',
    GET_CHURCH_CAMPUS_STAFFS: 'get_church_campus_staffs',
    HEALTH_CHECK: 'health_check',
    UPDATE_CHURCH_CAMPUS: 'update_church_campus',
    DELETE_CHURCH_CAMPUS: 'delete_church_campus',

    FALLBACK_CREATE_CHURCH_CAMPUS_STAFF: 'fallback_create_church_campus_staff',
}


export const MEMBER_COMMAND = {
    CREATE_MEMBER: 'create_member',
    GET_MEMBER: 'get_member',
    GET_MEMBERS: 'get_members',
    GET_MEMBERS_BY_IDS: 'get_members_by_ids',
    FALLBACK_CREATE_MEMBER: 'fallback_create_member',
}



export const ORDER_COMMAND = {
    GET_ORDER: 'get_order',
}

export const STORE_COMMAND = {
    GET_STORE: 'get_store',
}