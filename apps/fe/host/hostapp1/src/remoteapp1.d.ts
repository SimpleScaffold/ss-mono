declare module 'remoteapp1/RemoteApp1' {
    import { ComponentType } from 'react'

    interface RemoteApp1Props {
        num?: number
        setNum?: (value: number | ((prev: number) => number)) => void
    }

    const RemoteApp1: ComponentType<RemoteApp1Props>
    export default RemoteApp1
}
