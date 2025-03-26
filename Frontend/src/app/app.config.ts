import { ApplicationConfig, NgModule, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(),
		NgModule,
		DatePipe,
		FormsModule,
		ReactiveFormsModule,

		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimationsAsync(),
	],
};