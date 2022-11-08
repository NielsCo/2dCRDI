import {NgModule} from '@angular/core';
import {
  BrowserModule,
  HammerModule
} from '@angular/platform-browser';
import 'hammerjs';

import {AppComponent, FormatTimePipe} from './app.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FormatTimePipe
  ],
  imports: [
    BrowserModule,
    HammerModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
