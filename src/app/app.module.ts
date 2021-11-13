import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

import { ComponentsModule } from './components.module';

import { FunctionGlobal } from './@scripts/global';
import { HandController } from './@scripts/HandController';
import { YoutubeController } from './@scripts/YoutubeController';
import { AudioController } from './@scripts/AudioController';
import { Config } from './@scripts/config';
import { SpectrumController } from './@scripts/SpectrumController';
import { ActionGestures } from './@scripts/ActionGestures';
import { StorageController } from './@scripts/StorageController';

import { SettingsPageModule } from './settings/settings.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    SettingsPageModule
  ],
  providers: [
    FunctionGlobal,
    HandController,
    YoutubeController,
    AudioController,
    Config,
    SpectrumController,
    ActionGestures,
    StorageController,
    { provide: LocationStrategy , useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
