import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicLayoutComponent } from './shared/dynamic-layout/dynamic-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TekMegha');
}
