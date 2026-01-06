import { Button } from '@repo/fe-ui/button';
import './styles.css';

function Vite3() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Vite3 Application</h1>
        <p className="text-lg text-gray-600 mb-8">
          독립적인 애플리케이션 (포트 3003)
        </p>
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">V</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Vite3 User</h2>
              <p className="text-gray-600">vite3@example.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="Vite3 User"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="vite3@example.com"
              />
            </div>
            <div className="pt-4">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vite3;

