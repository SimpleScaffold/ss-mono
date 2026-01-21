import { Button } from '@repo/fe-ui/button'
import { Card } from '@repo/fe-ui/card'
import { Dialog, DialogTrigger } from '@repo/fe-ui/dialog'
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@repo/fe-ui/dialog'
import { Suspense, lazy } from 'react'

// Module Federation을 통해 RemoteApp1 동적 로드
const RemoteApp1 = lazy(() => import('remoteapp1/RemoteApp1'))

function HostApp1() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Host Application (Shell)
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    메인 호스트 애플리케이션 (포트 3001)
                    {/* <button
            className='bg-primary '
          >Action</button> */}
                    <Button>Action</Button>
                </p>

                {/* Remote App 1 로드 */}
                <div className="mt-8 border-t pt-8">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                        Remote App 1 (Module Federation)
                    </h2>
                    <Suspense
                        fallback={
                            <div className="py-8 text-center">
                                Loading Remote App 1...
                            </div>
                        }
                    >
                        <RemoteApp1 />
                    </Suspense>
                </div>
                <div className="space-y-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold">Item 1</h2>
                        <p className="mb-4 text-gray-600">
                            Description of item 1
                        </p>
                        <Button>Action</Button>

                        <Card></Card>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-2 text-xl font-semibold">Item 2</h2>
                        <p className="mb-4 text-gray-600">
                            Description of item 2
                        </p>
                        <Button size="sm">Action</Button>
                    </div>
                </div>

                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <label className="text-sm font-medium">
                                        Name
                                    </label>
                                    <input
                                        className="rounded border p-2"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <label className="text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        className="rounded border p-2"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        </div>
    )
}

export default HostApp1
