import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskProgressComponent } from '../task-progress/task-progress.component';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskProgressComponent, FormsModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-grid">
        
        <!-- Task Overview Cards -->
        <div class="stat-card">
          <h3>Total Tasks</h3>
          <div class="stat-value">{{ progress.total }}</div>
        </div>
        <div class="stat-card">
          <h3>In Progress</h3>
          <div class="stat-value">{{ progress.inProgress }}</div>
        </div>
        <div class="stat-card">
          <h3>Completed</h3>
          <div class="stat-value">{{ progress.completed }}</div>
        </div>

        <!-- Progress Component -->
        <app-task-progress class="progress-section"></app-task-progress>

        <!-- Upcoming Tasks with Add Button -->
        <div class="upcoming-tasks">
          <div class="task-header">
            <h3>Recent Updates</h3>
            <button class="add-task-btn" (click)="openAddTaskModal()">
              <i class="fas fa-plus"></i> Add Task
            </button>
          </div>
          <div class="task-list">
            <div *ngFor="let task of tasks; trackBy: trackByTaskId" class="task-item">
              <div class="task-info">
                <h4>{{ task.title }}</h4>
                <span class="status" [ngClass]="'status-' + task.status.toLowerCase()">
                  {{ task.status | titlecase }}
                </span>
              </div>
              <div class="task-meta">
                <span class="date">Updated: {{ task.updatedAt | date:'short' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Task Modal -->
      <div class="modal" *ngIf="showAddTaskModal">
        <div class="modal-content">
          <span class="close" (click)="closeAddTaskModal()">&times;</span>
          <h3>Add New Task</h3>
          <form (ngSubmit)="addTask()">
            <label>Title:</label>
            <input type="text" [(ngModel)]="newTask.title" name="title" required />

            <label>Description:</label>
            <textarea [(ngModel)]="newTask.description" name="description" required></textarea>

            <label>Status:</label>
            <select [(ngModel)]="newTask.status" name="status" required>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <label>Priority:</label>
            <select [(ngModel)]="newTask.priority" name="priority" required>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <label>Due Date:</label>
            <input type="date" [(ngModel)]="newTask.dueDate" name="dueDate" required />

            <button type="submit" class="submit-btn">Add Task</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* existing styles here */

    /* Modal Styles */
    .modal {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .close {
      font-size: 24px;
      float: right;
      cursor: pointer;
    }
    .submit-btn {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 10px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  progress = {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    completionPercentage: 0
  };
  showAddTaskModal = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: new Date()
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadProgress();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      ).slice(0, 5);
    });
  }

  loadProgress(): void {
    this.taskService.getTaskProgress().subscribe(progress => {
      this.progress = progress;
    });
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id!;
  }

  openAddTaskModal(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
    this.resetNewTask();
  }

  resetNewTask(): void {
    this.newTask = {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date()
    };
  }

  addTask(): void {
    const task: Task = {
      ...this.newTask,
      createdBy: 'user',  // Adjust this as needed
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;

    this.taskService.addTask(task).subscribe(() => {
      this.loadTasks();  // Refresh tasks after adding
      this.loadProgress();  // Refresh progress
      this.closeAddTaskModal();
    });
  }
}
