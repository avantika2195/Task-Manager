import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <h3>Task Progress</h3>
        <div class="completion-rate">
          {{ progress.completionPercentage | number:'1.0-0' }}% Complete
        </div>
      </div>

      <div class="progress-bars">
        <div class="progress-item">
          <div class="progress-label">
            <span>To Do</span>
            <span class="count">{{ progress.todo }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill todo"
              [style.width.%]="(progress.todo / progress.total) * 100"
            ></div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-label">
            <span>In Progress</span>
            <span class="count">{{ progress.inProgress }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill in-progress"
              [style.width.%]="(progress.inProgress / progress.total) * 100"
            ></div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-label">
            <span>Completed</span>
            <span class="count">{{ progress.completed }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill completed"
              [style.width.%]="(progress.completed / progress.total) * 100"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .completion-rate {
      font-size: 1.125rem;
      font-weight: 500;
      color: #1e40af;
    }
    .progress-bars {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .progress-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #4b5563;
    }
    .count {
      font-weight: 500;
    }
    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    .progress-fill.todo {
      background-color: #3b82f6;
    }
    .progress-fill.in-progress {
      background-color: #f59e0b;
    }
    .progress-fill.completed {
      background-color: #10b981;
    }
  `]
})
export class TaskProgressComponent implements OnInit {
  progress = {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    completionPercentage: 0
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTaskProgress().subscribe(progress => {
      this.progress = progress;
    });
  }
}