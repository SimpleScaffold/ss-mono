import { Button } from '@repo/fe-ui/button';
import { formatDate } from '@repo/fe-utils';
import './styles.css';

function RemoteApp1() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Remote App 1</h1>
        <p className="text-lg text-gray-600 mb-8">
          독립적인 리모트 애플리케이션 (포트 3002)zzzzzzzzzzzzzzㅊㅊㅊㅊㅊㅊㅊㅊㅊㅊ
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Item #1</h2>
            <p className="text-gray-600 mb-2">Date: {formatDate(new Date())}</p>
            <p className="text-gray-600 mb-4">Status: Active</p>
            <Button variant="secondary">View Details</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Item #2</h2>
            <p className="text-gray-600 mb-2">Date: {formatDate(new Date())}</p>
            <p className="text-gray-600 mb-4">Status: Completed</p>
            <Button variant="secondary">View Details</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoteApp1;
