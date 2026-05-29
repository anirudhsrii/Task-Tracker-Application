import { useState, useEffect } from 'react';

interface TaskFormProps {
  currentTask: any;
  clearCurrent: () => void;
  onSubmit: (task: any) => void;
}

const TaskForm = ({ currentTask, clearCurrent, onSubmit }: TaskFormProps) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const { title, description, status, priority, dueDate } = task;

  useEffect(() => {
    if (currentTask) {
      setTask(currentTask);
    } else {
      setTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [currentTask]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
    setTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-bold mb-2">{currentTask ? 'Tweak the task' : 'Add a new task'}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Keep it short, clear, and easy to revisit later.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="What needs doing?"
          name="title"
          value={title}
          onChange={onChange}
          className="input-field"
          required
        />
        <input
          type="date"
          name="dueDate"
          value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
          onChange={onChange}
          className="input-field"
        />
      </div>
       <textarea
         placeholder="A few details to make it easier to pick back up"
          name="description"
          value={description}
          onChange={onChange}
          className="input-field mt-4"
          required
        ></textarea>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <select name="status" value={status} onChange={onChange} className="input-field">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
         <select name="priority" value={priority} onChange={onChange} className="input-field">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mt-4">
        <button type="submit" className="btn-primary w-full md:w-auto">
          {currentTask ? 'Save changes' : 'Create task'}
        </button>
        {currentTask && (
          <button
            type="button"
            className="btn-secondary w-full md:w-auto ml-0 md:ml-2 mt-2 md:mt-0"
            onClick={clearAll}
          >
            Never mind
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
