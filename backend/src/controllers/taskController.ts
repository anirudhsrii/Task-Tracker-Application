import { Request, Response } from 'express';
import Task from '../models/Task';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: any, res: Response) => {
  try {
    // Implement filtering (status, priority) and search (title)
    const { status, priority, search, sortBy } = req.query;
    let query: any = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    let tasksQuery = Task.find(query);

    // Sorting
    if (sortBy === 'dueDate') {
      tasksQuery = tasksQuery.sort({ dueDate: 1 });
    } else if (sortBy === 'priority') {
      tasksQuery = tasksQuery.sort({ priority: 1 }); // low to high? usually high first but user can decide
    } else {
      tasksQuery = tasksQuery.sort({ createdAt: -1 });
    }

    const tasks = await tasksQuery;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get analytics
// @route   GET /api/tasks/analytics
// @access  Private
export const getAnalytics = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: 'done',
    });
    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: 'done' },
    });
    const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage: completionPercentage.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updateData = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne(); // or findByIdAndDelete
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
