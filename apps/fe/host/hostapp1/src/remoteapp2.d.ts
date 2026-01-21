declare module 'remoteapp2/RemoteApp2' {
    import { ComponentType } from 'react'

    interface RemoteApp2Props {
        num?: number
        setNum?: (value: number | ((prev: number) => number)) => void
    }

    const RemoteApp2: ComponentType<RemoteApp2Props>
    export default RemoteApp2
}
