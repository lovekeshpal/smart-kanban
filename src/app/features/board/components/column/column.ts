import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { TaskCard } from '../task-card/task-card';
import { BoardStore } from '../../../../core/stores/board.store';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-column',
  imports: [CommonModule, DragDropModule, TaskCard],
  templateUrl: './column.html',
  styleUrl: './column.scss',
})
export class Column {
  @Input() title!: string;
  @Input() tasks: Task[] = [];
  @Input() colorClass: 'indigo' | 'amber' | 'emerald' = 'indigo';
  @Input() connectedLists: string[] = [];

  @ViewChild('dropListRef') dropList!: CdkDropList<Task>;

  constructor(private boardStore: BoardStore) {}

  onTaskDropped(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const task = event.item.data;

    let newStatus: Task['status'] = 'todo';

    if (this.title === 'In Progress') newStatus = 'in-progress';
    if (this.title === 'Done') newStatus = 'done';

    this.boardStore.updateTaskStatus(task.id, newStatus);
  }

  getColorClasses() {
    const colors: Record<
      string,
      { header: string; bg: string; border: string }
    > = {
      indigo: {
        header: 'bg-indigo-500 text-white',
        bg: 'bg-indigo-100',
        border: 'border-indigo-200',
      },
      amber: {
        header: 'bg-amber-500 text-white',
        bg: 'bg-amber-100',
        border: 'border-amber-200',
      },
      emerald: {
        header: 'bg-emerald-500 text-white',
        bg: 'bg-emerald-100',
        border: 'border-emerald-200',
      },
    };

    return colors[this.colorClass];
  }
}
