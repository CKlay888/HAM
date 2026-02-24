declare class NotificationTypesDto {
    purchase?: boolean;
    review?: boolean;
    system?: boolean;
    promotion?: boolean;
}
export declare class NotificationSettingsDto {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    types?: NotificationTypesDto;
}
export {};
