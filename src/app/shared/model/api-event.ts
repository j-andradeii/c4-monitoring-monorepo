export class ApiEvent {
    type: ApiEventType;
    status: ApiEventStatus;
    title?: string;
    message?: string;
    spinner?: boolean;
    popup?: boolean;
    toast?: boolean;
}

export enum ApiEventStatus {
    DEFAULT,
    IN_PROGRESS,
    COMPLETED,
    ERROR,
}

export enum ApiEventType {
    DEFAULT,
    GET_CHURCHES,
    SIGN_OUT
}
