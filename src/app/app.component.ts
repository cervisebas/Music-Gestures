import { HandController } from './@scripts/HandController';
import { YoutubeController } from './@scripts/YoutubeController';
import { AudioController } from './@scripts/AudioController';
import { FunctionGlobal } from './@scripts/global';
import { Config } from './@scripts/config';
import { Component } from '@angular/core';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { Menu } from '@electron/remote';

declare global {
  interface Window  {
    HandController: any,
    YoutubeController: any,
    AudioController: any,
    ConfigApp: any
  }
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public handController: HandController,
    public youtubeController: YoutubeController,
    public audioController: AudioController,
    public fglobal: FunctionGlobal,
    public config: Config
  ) {}
  ngOnInit() {
    const titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#212121'),
      titleHorizontalAlignment: 'left',
      menu: new Menu()
    });
    this.fglobal.titleBar = titlebar;
    window.HandController = this.handController;
    window.YoutubeController = this.youtubeController;
    window.AudioController = this.audioController;
    window.ConfigApp = this.config;
  }
}
