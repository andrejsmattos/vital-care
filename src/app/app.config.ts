import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { DashboardService } from './services/dashboard.service'; // Certifique-se de que o caminho está correto

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    DashboardService
  ]
};
