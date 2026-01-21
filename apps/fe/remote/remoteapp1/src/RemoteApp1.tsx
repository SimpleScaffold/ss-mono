import { Button } from '@repo/fe-ui/button'
import { formatDate } from '@repo/fe-utils'
import './styles.css'

interface ItemCardProps {
    title: string
    date: Date
    status: string
}

function ItemCard({ title, date, status }: ItemCardProps) {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-2 text-gray-600">Date: {formatDate(date)}</p>
            <p className="mb-4 text-gray-600">Status: {status}</p>
            <Button variant="secondary">View Details</Button>
        </div>
    )
}

const ITEMS = [
    { title: 'Item #1', status: 'Active' },
    { title: 'Item #2', status: 'Completed' },
] as const

interface RemoteApp1Props {
    num?: number
    setNum?: (value: number | ((prev: number) => number)) => void
}

function RemoteApp1({ num, setNum }: RemoteApp1Props) {
    const currentDate = new Date()

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Remote App 1
                    </h1>
                    <p className="text-lg text-gray-600">
                        독립적인 리모트 애플리케이션 (포트 3002)
                    </p>
                    {num !== undefined && setNum && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4">
                            <p className="mb-2 text-lg font-semibold text-blue-900">
                                Host 앱 상태 접근: num = {num}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setNum((prev) => prev + 1)}
                                    variant="default"
                                >
                                    +1 증가
                                </Button>
                                <Button
                                    onClick={() => setNum((prev) => prev - 1)}
                                    variant="outline"
                                >
                                    -1 감소
                                </Button>
                                <Button
                                    onClick={() => setNum(0)}
                                    variant="secondary"
                                >
                                    리셋
                                </Button>
                            </div>
                        </div>
                    )}
                </header>

                <section className="space-y-4">
                    {ITEMS.map((item) => (
                        <ItemCard
                            key={item.title}
                            title={item.title}
                            date={currentDate}
                            status={item.status}
                        />
                    ))}
                </section>
            </div>
        </div>
    )
}

export default RemoteApp1
