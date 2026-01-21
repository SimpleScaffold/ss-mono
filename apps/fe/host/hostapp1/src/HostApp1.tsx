import { Button } from '@repo/fe-ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@repo/fe-ui/dialog'
import { Suspense, lazy, useId } from 'react'

const RemoteApp1 = lazy(() => import('remoteapp1/RemoteApp1'))
const RemoteApp2 = lazy(() => import('remoteapp2/RemoteApp2'))

interface RemoteAppSectionProps {
    title: string
    appName: string
    children: React.ReactNode
}

function RemoteAppSection({
    title,
    appName,
    children,
}: RemoteAppSectionProps) {
    return (
        <section className="mt-8 border-t pt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
            <Suspense
                fallback={
                    <div className="py-8 text-center">
                        Loading {appName}...
                    </div>
                }
            >
                {children}
            </Suspense>
        </section>
    )
}

interface ItemCardProps {
    title: string
    description: string
    buttonSize?: 'default' | 'sm'
}

function ItemCard({ title, description, buttonSize = 'default' }: ItemCardProps) {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-4 text-gray-600">{description}</p>
            <Button size={buttonSize}>Action</Button>
        </div>
    )
}

function ProfileDialog() {
    const nameId = useId()
    const emailId = useId()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <label htmlFor={nameId} className="text-sm font-medium">
                                Name
                            </label>
                            <input
                                id={nameId}
                                className="rounded border p-2"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid gap-3">
                            <label htmlFor={emailId} className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id={emailId}
                                type="email"
                                className="rounded border p-2"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const ITEMS = [
    { title: 'Item 1', description: 'Description of item 1' },
    { title: 'Item 2', description: 'Description of item 2', buttonSize: 'sm' as const },
] as const

function HostApp1() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Host Application (Shell)
                    </h1>
                    <p className="text-lg text-gray-600">
                        메인 호스트 애플리케이션 (포트 3001)
                    </p>
                </header>

                <RemoteAppSection
                    title="Remote App 1 (Module Federation)"
                    appName="Remote App 1"
                >
                    <RemoteApp1 />
                </RemoteAppSection>

                <RemoteAppSection
                    title="Remote App 2 (Module Federation)"
                    appName="Remote App 2"
                >
                    <RemoteApp2 />
                </RemoteAppSection>

                <section className="mt-8 space-y-4">
                    {ITEMS.map((item) => (
                        <ItemCard
                            key={item.title}
                            title={item.title}
                            description={item.description}
                            buttonSize={item.buttonSize}
                        />
                    ))}
                </section>

                <div className="mt-8">
                    <ProfileDialog />
                </div>
            </div>
        </div>
    )
}

export default HostApp1
