import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskProgressComponent } from '../task-progress/task-progress.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskProgressComponent],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h2>My Tasks</h2>
      </div>

      <app-task-progress class="progress-section" />

      <div class="tasks-grid">
        @for (task of tasks; track task.id) {
          <div class="task-card" [class]="'priority-' + task.priority.toLowerCase()">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <div class="task-actions">
                <select 
                  [value]="task.status"
                  (change)="updateTaskStatus(task.id!, $event)"
                  class="status-select"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <p class="description">{{ task.description }}</p>
            <div class="task-meta">
              <span class="status" [class]="'status-' + task.status.toLowerCase()">
                {{ task.status | titlecase }}
              </span>
              <span class="due-date">Due: {{ task.dueDate | date }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
    }
    .header {
      margin-bottom: 24px;
    }
    .progress-section {
      display: block;
      margin-bottom: 24px;
    }
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .task-card {
      padding: 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .task-header h3 {
      margin: 0;
      font-size: 1.125rem;
    }
    .description {
      color: #4b5563;
      margin-bottom: 16px;
    }
    .task-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }
    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .status-todo { background: #dbeafe; color: #1e40af; }
    .status-in_progress { background: #fef3c7; color: #92400e; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .due-date {
      color: #6b7280;
    }
    .status-select {
      padding: 4px 8px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .status-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    .priority-high { border-left: 4px solid #ef4444; }
    .priority-medium { border-left: 4px solid #f59e0b; }
    .priority-low { border-left: 4px solid #10b981; }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  updateTaskStatus(taskId: string, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    this.taskService.updateTaskStatus(taskId, status).subscribe();
  }
}