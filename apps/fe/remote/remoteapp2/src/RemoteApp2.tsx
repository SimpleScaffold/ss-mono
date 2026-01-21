import { Button } from '@repo/fe-ui/button'
import './styles.css'

function RemoteApp2() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Remote App 2
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    독립적인 리모트 애플리케이션 (포트 3003)
                </p>
                <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
                    <div className="mb-6 flex items-center space-x-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
                            <span className="text-2xl font-bold text-gray-600">
                                R
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">
                                RemoteApp2 User
                            </h2>
                            <p className="text-gray-600">
                                remoteapp2@example.com
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                defaultValue="RemoteApp2 User"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                defaultValue="remoteapp2@example.com"
                            />
                        </div>
                        <div className="pt-4">
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemoteApp2
