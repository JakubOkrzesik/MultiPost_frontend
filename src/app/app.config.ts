import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideConfigInitializer} from "./core/config-initilizer";
import {ConfigService} from "./services/config.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (configService: ConfigService) => () => configService.loadConfig(),
      deps: [ConfigService]
    }]
};
