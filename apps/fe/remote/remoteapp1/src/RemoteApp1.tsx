import { Button } from '@repo/fe-ui/button'
import { formatDate } from '@repo/fe-utils'
import './styles.css'

function RemoteApp1() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Remote App 1
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    독립적인 리모트 애플리케이션 (포트 3002)
                </p>
                <div className="space-y-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold">Item #1</h2>
                        <p className="mb-2 text-gray-600">
                            Date: {formatDate(new Date())}
                        </p>
                        <p className="mb-4 text-gray-600">Status: Active</p>
                        <Button variant="secondary">View Details</Button>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold">Item #2</h2>
                        <p className="mb-2 text-gray-600">
                            Date: {formatDate(new Date())}
                        </p>
                        <p className="mb-4 text-gray-600">Status: Completed</p>
                        <Button variant="secondary">View Details</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemoteApp1
