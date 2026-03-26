import React from 'react';
import { Pencil, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskList = ({ tasks, onDelete, onEdit, onToggleStatus }: TaskListProps) => { // Removed extra closing parenthesis
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="text-green-500" />;
      case 'in-progress': return <Clock className="text-blue-500" />;
      default: return <AlertCircle className="text-gray-500" />;
    }
  };

  if(!tasks || tasks.length === 0) {
      return <p className="text-center text-gray-500">No tasks found.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <div key={task._id} className={`card flex flex-col md:flex-row justify-between items-start md:items-center ${task.status === 'done' ? 'opacity-75' : ''}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
               {getStatusIcon(task.status)}
               <h3 className={`text-lg font-bold ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</h3>
               <span className={`text-xs font-bold uppercase ${getPriorityColor(task.priority)} border px-2 py-0.5 rounded-full border-current`}>
                {task.priority}
               </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
            {task.dueDate && (
                <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
             <button onClick={() => onToggleStatus(task)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title={task.status === 'done' ? "Mark Undone" : "Mark Done"}>
                <CheckCircle size={20} className={task.status === 'done' ? 'text-green-600' : 'text-gray-400'} />
             </button>
            <button onClick={() => onEdit(task)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500">
              <Pencil size={20} />
            </button>
            <button onClick={() => onDelete(task._id)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
