export interface AuthCredsDto {
    email: string;
    password: string;
    username?: string;
}

export interface AuthDto {
    access_token: string;
    refresh_token: string;
}

export interface SelfInformationDto {
    member_id: string;
    church_id: string;
    church_campus_id: string;
    church_campus_roles: Array<string>;
}