import DashboardLayout from '@/components/dashboard/DashboardLayout';

/**
 * Dashboard Page Component
 * Features the complete Atlas dashboard interface with sidebar navigation
 */
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-light text-slate-900 mb-6">
            Atlas Dashboard
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            Welcome to the Atlas Real Estate Intelligence Dashboard. 
            Use the sidebar navigation to access different sections and tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-sage-green/20 shadow-sm">
              <h3 className="font-serif text-xl font-semibold mb-3 text-slate-900">
                📊 Overview
              </h3>
              <p className="text-slate-600">
                Key metrics and dashboard overview
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-sage-green/20 shadow-sm">
              <h3 className="font-serif text-xl font-semibold mb-3 text-slate-900">
                🛠️ Tools
              </h3>
              <p className="text-slate-600">
                Real estate intelligence tools suite
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-sage-green/20 shadow-sm">
              <h3 className="font-serif text-xl font-semibold mb-3 text-slate-900">
                📈 Analytics
              </h3>
              <p className="text-slate-600">
                Market analysis and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 