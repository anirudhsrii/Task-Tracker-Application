import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Analytics from '../components/Analytics';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [analytics, setAnalytics] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionPercentage: '0' });
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(!loading && !user) {
        navigate('/login');
    }
  }, [user, loading, navigate]);

  const loadData = async () => {
    try {
        if (!user) return;
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
        setFilteredTasks(res.data);

        const analyticsRes = await axios.get('/api/tasks/analytics');
        setAnalytics(analyticsRes.data);
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    if(user) loadData();
  }, [user]);

  // Filtering Effect
  useEffect(() => {
    let result = tasks;
    if (filter.status) {
      result = result.filter((task: any) => task.status === filter.status);
    }
    if (filter.priority) {
      result = result.filter((task: any) => task.priority === filter.priority);
    }
    if (search) {
      result = result.filter((task: any) => task.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredTasks(result);
  }, [tasks, filter, search]);

  const addTask = async (task: any) => {
    try {
      if(currentTask) {
        // Update
        const res = await axios.put(`/api/tasks/${(currentTask as any)._id}`, task);
        setTasks(tasks.map((t: any) => (t._id === res.data._id ? res.data : t)) as any);
        toast.success('Task Updated');
      } else {
        // Create
        const res = await axios.post('/api/tasks', task);
        setTasks([res.data, ...tasks] as any);
        toast.success('Task Added');
      }
      setCurrentTask(null);
      loadData(); // Reload analytics
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving task');
    }
  };

  const deleteTask = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter((t: any) => t._id !== id));
        toast.success('Task Deleted');
         loadData();
      } catch (err: any) {
        toast.error('Error deleting task');
      }
    }
  };

  const editTask = (task: any) => {
    setCurrentTask(task);
  };

  const toggleStatus = async (task: any) => {
      // Toggle
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      try {
           const res = await axios.put(`/api/tasks/${task._id}`, { ...task, status: newStatus });
           setTasks(tasks.map((t: any) => (t._id === res.data._id ? res.data : t)) as any);
           loadData();
      } catch (err) {
          toast.error('Status update failed');
      }
  };

  const clearCurrent = () => {
    setCurrentTask(null);
  };

  if(!user) return <p>Loading...</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Your work, in one place</p>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Keep track of what’s moving, what’s stuck, and what needs a nudge. Add a task, filter the list, and stay on top of the day without the clutter.
        </p>
      </div>

      <Analytics data={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
             <TaskForm currentTask={currentTask} clearCurrent={clearCurrent} onSubmit={addTask} />
          </div>
        </div>

        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="input-field"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="input-field"
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <select
                    className="input-field"
                    onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
           <TaskList
                tasks={filteredTasks}
                onDelete={deleteTask}
                onEdit={editTask}
                onToggleStatus={toggleStatus}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
