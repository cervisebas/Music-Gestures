import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Config } from '../@scripts/config';
import * as $ from 'jquery';

declare global {
  interface Window {
    listMusicsPage: any
  }
}

type config = {
  fps: number,
  playlist: string,
  resolution: {
    width: number,
    height: number
  },
  colors: boolean,
  storage: boolean,
  webcamId: (string | undefined)
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private config: Config
  ) { }

  public WebcamSelect: string = '';
  public StorageSelect: string = '';

  async ngOnInit() {
    var webcams = await this.config.getWebcams();
    webcams.forEach((value, index: number)=>{
      $('ion-item#camaras-setting ion-select').append($('<ion-select-option></ion-select-option>').attr('value', value.deviceId).html(value.label));
      if (index == 0) { $('ion-item#camaras-setting ion-select').attr('value', value.deviceId); }
    });
    var config = await this.config.getConfig();
    $('ion-item#fps-setting ion-input').attr('value', config.fps);
    $('ion-item#playlist-setting ion-input').attr('value', config.playlist);
    if (config.colors == true) { $('ion-item#colors-setting ion-toggle').attr('checked', 'true'); }
    $('ion-item#camaras-setting ion-select').attr('value', config.webcamId);
    $('ion-item#storage-setting ion-select').attr('value', (config.storage)? 'local' : 'youtube');
  }

  async setConfig() {
    var toogle: any = $('ion-item#colors-setting ion-toggle')[0];
    var colors: boolean = (toogle.checked == true)? true : false;
    var webcams = await this.config.getWebcams();
    var selectId: string = (this.WebcamSelect != '')? this.WebcamSelect : webcams[0].deviceId;
    var selectStorage: boolean = (this.StorageSelect != '')? ((this.StorageSelect == 'local')? true : false) : this.config.globalConfig.storage;
    var fps: any = $('ion-item#fps-setting ion-input input').val();
    var playlist: any = $('ion-item#playlist-setting ion-input input').val();
    var newConfig: config = {
      resolution: this.config.globalConfig.resolution,
      fps: fps,
      playlist: playlist,
      colors: colors,
      storage: selectStorage,
      webcamId: selectId
    };
    this.config.setConfig(newConfig, true);
    const toast = await this.toastController.create({ header: 'Configuración guardada.', duration: 850 });
    return await toast.present();
  }

  changeSelect($event: any) { return this.WebcamSelect = $event.detail.value; }
  changeStorage($event: any) { return this.StorageSelect = $event.detail.value; }

  async dismiss() { return await this.modalController.dismiss(); }
}
