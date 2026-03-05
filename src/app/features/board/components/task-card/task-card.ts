import { Component, Input } from '@angular/core';
import { BoardStore } from '../../../../core/stores/board.store';
import { Task, TaskPriority } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
    @Input() task!: Task;

  constructor(private boardStore: BoardStore) {}

  moveToTodo() {
    this.boardStore.updateTaskStatus(this.task.id, 'todo');
  }

  moveToProgress() {
    this.boardStore.updateTaskStatus(this.task.id, 'in-progress');
  }

  moveToDone() {
    this.boardStore.updateTaskStatus(this.task.id, 'done');
  }

  deleteTask() {
    this.boardStore.deleteTask(this.task.id);
  }

  getPriorityColor(priority: TaskPriority): string {
    const colors: Record<TaskPriority, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-amber-100 text-amber-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  }

  getFormattedDate(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}

