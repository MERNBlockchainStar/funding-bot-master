import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { MainWndComponent } from './main-wnd/main-wnd.component';
import { FundingRatesComponent } from './funding-rates/funding-rates.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FundingRatesCoinComponent } from './funding-rates-coin/funding-rates-coin.component';

@NgModule({
  declarations: [
    AppComponent, 
    MainWndComponent,
    FundingRatesComponent,
    FundingRatesCoinComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
