import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common"; // Import DatePipe

@NgModule({
	providers: [DatePipe], // Provide DatePipe globally
})
export class DatePipeModule {}
