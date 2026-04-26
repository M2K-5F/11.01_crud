import { Elysia, t } from "elysia";
import { DeviceID, type Device } from "../entities";

const deviceIdentity = new Elysia({ name: 'device-identity' })
    .derive({ as: "scoped" }, ({ request, cookie: { device_id } }) => {
        const ua = request.headers.get('user-agent') || 'unknown'
        
        let currentId = device_id?.value as string | undefined
            
        if (!currentId) {
            currentId = crypto.randomUUID()
            device_id?.set({
                value: currentId,
                httpOnly: true,
                path: '/',
                maxAge: 31536000, 
                sameSite: 'lax'
            })
        }

        const getOS = (ua: string) => {
            if (ua.includes('Windows')) return 'Windows'
            if (ua.includes('Mac OS')) return 'macOS'
            if (ua.includes('Linux')) return 'Linux'
            if (ua.includes('Android')) return 'Android'
            if (ua.includes('iPhone')) return 'iOS'
            return 'Unknown OS'
        }

        const getBrowser = (ua: string) => {
            if (ua.includes('Firefox')) return 'Firefox'
            if (ua.includes('Chrome')) return 'Chrome'
            if (ua.includes('Safari')) return 'Safari'
            if (ua.includes('Edge')) return 'Edge'
            return 'Unknown Browser'
        }

        const device: Device = {
            device_id: DeviceID.fromString(currentId),
            ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
            os: getOS(ua),
            browser: getBrowser(ua),
            ua: ua
        }

        return { device }
    })

    export default deviceIdentity