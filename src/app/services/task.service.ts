// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Initial list of tasks for demonstration
  private tasks = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'Complete Project Proposal',
      description: 'Draft and submit the project proposal for client review',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2024-01-20'),
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Review Code Changes',
      description: 'Review pull requests and provide feedback',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2024-01-22'),
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Update Documentation',
      description: 'Update project documentation with recent changes',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: new Date('2024-01-25'),
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Fetch tasks as an observable
  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  // Update the status of a specific task and return it as an observable
  updateTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'): Observable<Task | undefined> {
    const updatedTasks = this.tasks.value.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status,
          updatedAt: new Date()
        };
      }
      return task;
    });

    this.tasks.next(updatedTasks);
    return of(updatedTasks.find(task => task.id === taskId)).pipe(delay(300));
  }

  // Calculate task progress summary
  getTaskProgress(): Observable<{
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    completionPercentage: number;
  }> {
    return this.tasks.pipe(
      map(tasks => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const todo = tasks.filter(t => t.status === 'TODO').length;
        
        return {
          total,
          completed,
          inProgress,
          todo,
          completionPercentage: (completed / total) * 100
        };
      })
    );
  }

  // Add a new task to the list
  addTask(newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const task: Task = {
      ...newTask,
      id: (this.tasks.value.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTasks = [...this.tasks.value, task];
    this.tasks.next(updatedTasks);
    return of(task).pipe(delay(300));
  }
}
