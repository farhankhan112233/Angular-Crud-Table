import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentInformation } from '../student-information/student-information';

@Component({
  selector: 'app-root',
  imports: [StudentInformation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('CRUD');
}
