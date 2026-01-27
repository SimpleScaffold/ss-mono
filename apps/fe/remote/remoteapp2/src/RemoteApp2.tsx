import { Button } from '@repo/fe-ui/button'
import { formatDate } from '@repo/fe-utils'
import { useId } from 'react'
import './styles.css'

interface FormFieldProps {
    id: string
    label: string
    type?: string
    defaultValue: string
}

function FormField({ id, label, type = 'text', defaultValue }: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                defaultValue={defaultValue}
            />
        </div>
    )
}

interface RemoteApp2Props {
    num?: number
    setNum?: (value: number | ((prev: number) => number)) => void
}

function RemoteApp2({ num, setNum }: RemoteApp2Props) {
    const nameId = useId()
    const emailId = useId()
    const currentDate = new Date()

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Remote App 2
                    </h1>
                    <p className="text-lg text-gray-600">
                        독립적인 리모트 애플리케이션 (포트 3003)
                    </p>
                    {num !== undefined && setNum && (
                        <div className="mt-4 rounded-lg bg-green-50 p-4">
                            <p className="mb-2 text-lg font-semibold text-green-900">
                                Host 앱 상태 접근: num = {num}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setNum((prev) => prev + 10)}
                                    variant="default"
                                >
                                    +10 증가
                                </Button>
                                <Button
                                    onClick={() => setNum((prev) => prev - 10)}
                                    variant="outline"
                                >
                                    -10 감소
                                </Button>
                            </div>
                        </div>
                    )}
                </header>

                <section className="max-w-2xl rounded-lg bg-white p-6 shadow">
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
                            <p className="mt-1 text-sm text-gray-500">
                                Last updated: {formatDate(currentDate)}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                    >
                        <div className="space-y-4">
                            <FormField
                                id={nameId}
                                label="Name"
                                defaultValue="RemoteApp2 User"
                            />
                            <FormField
                                id={emailId}
                                label="Email"
                                type="email"
                                defaultValue="remoteapp2@example.com"
                            />
                            <div className="pt-4">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default RemoteApp2
