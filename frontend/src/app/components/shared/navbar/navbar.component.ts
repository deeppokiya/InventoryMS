import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="topbar">
      <h2 class="page-title">{{ title }}</h2>
      <div class="topbar-right">
        <span class="date">{{ today | date:'fullDate' }}</span>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      background: white; padding: 16px 32px; display: flex;
      align-items: center; justify-content: space-between;
      border-bottom: 1px solid #e2e8f0; margin-left: 260px;
    }
    .page-title { margin: 0; font-size: 20px; font-weight: 700; color: #1e3a5f; }
    .date { color: #666; font-size: 14px; }
  `]
})
export class NavbarComponent {
  @Input() title = 'Dashboard';
  today = new Date();
}
