import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Bell
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { Task } from '../../types/management.types';

export const OperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notifications'>('tasks');

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/operations/tasks');
      return response.data.data as Task[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operations</h1>
          <p className="text-text-dim mt-1">Manage farm tasks, alerts and notifications</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

       <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tasks' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Active Tasks
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'notifications' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                    <input type="text" placeholder="Search tasks..." className="input pl-10 h-11" />
                </div>

                <div className="space-y-3">
                    {isLoadingTasks ? (
                        [...Array(3)].map((_, i) => <div key={i} className="glass h-20 animate-pulse rounded-2xl"></div>)
                    ) : tasks?.length === 0 ? (
                        <div className="glass p-12 text-center rounded-3xl">
                            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-text-dim/20" />
                            <h3 className="text-xl font-bold">Clean Workspace!</h3>
                            <p className="text-text-dim mt-1">You have no pending tasks for today.</p>
                        </div>
                    ) : (
                        tasks?.map(task => (
                            <div key={task.id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${
                                        task.priority === 'urgent' ? 'bg-error' : 
                                        task.priority === 'high' ? 'bg-warning' : 'bg-primary'
                                    }`} />
                                    <div>
                                        <h4 className="font-bold">{task.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-text-dim mt-1">
                                            <span className="flex items-center gap-1 capitalize">
                                                <Clock className="w-3 h-3" />
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 capitalize">
                                                <AlertCircle className="w-3 h-3" />
                                                Priority: {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="btn btn-outline text-[10px] h-8 min-h-0 py-1">Complete</button>
                                    <button className="text-text-dim hover:text-text-main"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="glass p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Today's Progress
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-text-dim text-xs font-bold uppercase">Completion Rate</span>
                            <span className="font-bold">64%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-success w-[64%] shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all" />
                        </div>
                        <p className="text-[10px] text-text-dim">4 of 6 primary tasks completed for this shift.</p>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
                 <h3 className="font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Latest Alerts
                </h3>
                <button className="text-xs text-primary hover:underline">Mark all as read</button>
            </div>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center text-info">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Inventory Alert: Corn Stock Low</p>
                        <p className="text-xs text-text-dim uppercase mt-0.5">2 hours ago</p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
