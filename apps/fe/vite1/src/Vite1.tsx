import { Button } from '@repo/fe-ui/button';
import { Card } from '@repo/fe-ui/card';
import { Dialog, DialogTrigger } from '@repo/fe-ui/dialog';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@repo/fe-ui/dialog';
import './styles.css';

function Vite1() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Vite1 Application</h1>
        <p className="text-lg text-gray-600 mb-8">
          독립적인 애플리케이션 (포트 3001)
          <Button>Action</Button>
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Item 1</h2>
            <p className="text-gray-600 mb-4">Description of item 1</p>
            <Button>Action</Button>

            <Card></Card>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Item 2</h2>
            <p className="text-gray-600 mb-4">Description of item 2</p>
            <Button>Action</Button>
          </div>
        </div>


        <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button >Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
ㅁㅁㅁㅁㅁㅁㅁㅁ
            </div>
            <div className="grid gap-3">
    ㅁㅁㅁㅁㅁㅁ
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
  );
}

export default Vite1;

