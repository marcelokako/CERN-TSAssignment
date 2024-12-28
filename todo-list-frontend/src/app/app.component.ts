import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {BehaviorSubject, Observable} from "rxjs";
import {finalize, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" [(ngModel)]="searchInput" (change)="filterTodoList()">
      <app-progress-bar *ngIf="isLoading"></app-progress-bar>
      <div *ngFor="let todo of todos$ | async">
        <app-todo-item
          [item]="todo"
          (click)="removeTodo(todo)"
          >
        </app-todo-item>
        <app-progress-bar *ngIf="isProgressVisible(todo.id)"></app-progress-bar>
      </div>
      
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;
  progressBarsVisible: { [key: number]: boolean } = {};
  isLoading: boolean = true
  searchInput: string = ""
  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private todoService: TodoService) {
    this.todos$ = this.searchSubject.pipe(
      switchMap(searchTerm => {
        this.isLoading = true;
        return this.todoService.getAll().pipe(
          map(todos => todos.filter(
            todo => todo.task.includes(searchTerm)
          )),
          finalize(()=>(this.isLoading = false))
        );
      })
    )
  }

  filterTodoList() {
    this.searchSubject.next(this.searchInput);
  }

  isProgressVisible(todoId: number): boolean {
    return !!this.progressBarsVisible[todoId];
  }

  removeTodo(todo: Todo){
    this.progressBarsVisible[todo.id] = true;

    this.todoService.remove(todo.id).subscribe({
      next: ()=>{
        console.log(todo.id + " removed successfully");
        this.progressBarsVisible[todo.id] = false;

        this.filterTodoList();
      },
      error: (e)=>{
        console.error("Failed to remove todo. Error: ", e)
        this.progressBarsVisible[todo.id] = false;
        alert('Failed to remove todo');

      }
    });
  }
}
