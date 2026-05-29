// In-memory mock database for development without MongoDB
import bcrypt from 'bcryptjs';

let users: any[] = [];
let tasks: any[] = [];
let idCounter = { users: 1, tasks: 1 };

export const mockDb = {
  users: {
    findOne: (query: any) => {
      let user = users.find(u => Object.keys(query).every(k => u[k] === query[k])) || null;
      if (user) {
        user.matchPassword = async (enteredPassword: string) => {
          return await bcrypt.compare(enteredPassword, user.password);
        };
      }
      return Promise.resolve(user);
    },
    create: async (data: any) => {
      // Hash password before storing
      const hashedData = { ...data };
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        hashedData.password = await bcrypt.hash(data.password, salt);
      }
      const doc = { _id: idCounter.users++, ...hashedData };
      users.push(doc);
      return Promise.resolve(doc);
    },
  },
  tasks: {
    find: (query: any) => {
      return {
        sort: (sort: any) => {
          const filtered = tasks.filter(t => Object.keys(query).every(k => {
            if (k === 'title' && query[k].$regex) {
              return new RegExp(query[k].$regex, query[k].$options || '').test(t[k]);
            }
            if (k === 'status' && query[k].$ne) {
              return t[k] !== query[k].$ne;
            }
            return t[k] === query[k];
          }));
          
          filtered.sort((a, b) => {
            for (const [key, order] of Object.entries(sort)) {
              const aVal = a[key];
              const bVal = b[key];
              if (aVal === undefined || bVal === undefined) continue;
              if (aVal < bVal) return (order as number) === 1 ? -1 : 1;
              if (aVal > bVal) return (order as number) === 1 ? 1 : -1;
            }
            return 0;
          });
          return Promise.resolve(filtered);
        }
      };
    },
    countDocuments: (query: any) => {
      const count = tasks.filter(t => Object.keys(query).every(k => {
        if (query[k].$ne) return t[k] !== query[k].$ne;
        return t[k] === query[k];
      })).length;
      return Promise.resolve(count);
    },
    create: (data: any) => {
      const doc = { _id: idCounter.tasks++, ...data, createdAt: new Date(), updatedAt: new Date() };
      tasks.push(doc);
      return Promise.resolve(doc);
    },
    findById: (id: any) => {
      return Promise.resolve(tasks.find(t => t._id == id) || null);
    },
    findByIdAndUpdate: (id: any, update: any) => {
      const task = tasks.find(t => t._id == id);
      if (!task) return Promise.resolve(null);
      Object.assign(task, update, { updatedAt: new Date() });
      return Promise.resolve(task);
    },
  }
};

export const connectMockDb = () => {
  console.log('✓ Using in-memory mock database for development');
  return Promise.resolve();
};
