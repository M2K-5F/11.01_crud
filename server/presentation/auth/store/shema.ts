export type DeviceRow = {
    device_id: string,
    ip: string,
    os: string,
    browser: string,
    ua: string
}

export type SessionRow = {
    id: string,
    user_id: string,
    device: DeviceRow,
    last_activity: Date,
    current_token: string,
}