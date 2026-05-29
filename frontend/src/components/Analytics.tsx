import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Analytics = ({ data }: { data: AnalyticsData }) => {
  const pieData = [
    { name: 'Completed', value: data.completedTasks },
    { name: 'Pending', value: data.pendingTasks },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="card text-center bg-blue-100 dark:bg-blue-900">
        <h3 className="text-lg font-semibold">Everything on deck</h3>
        <p className="text-3xl font-bold">{data.totalTasks}</p>
      </div>
      <div className="card text-center bg-green-100 dark:bg-green-900">
        <h3 className="text-lg font-semibold">Finished</h3>
        <p className="text-3xl font-bold">{data.completedTasks}</p>
      </div>
      <div className="card text-center bg-yellow-100 dark:bg-yellow-900">
        <h3 className="text-lg font-semibold">Still open</h3>
        <p className="text-3xl font-bold">{data.pendingTasks}</p>
      </div>
      <div className="card text-center bg-purple-100 dark:bg-purple-900">
        <h3 className="text-lg font-semibold">Momentum</h3>
        <p className="text-3xl font-bold">{data.completionPercentage}%</p>
      </div>

      <div className="col-span-1 md:col-span-2 h-64 card">
        <h3 className="text-lg font-semibold mb-2">How the work is split</h3>
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
