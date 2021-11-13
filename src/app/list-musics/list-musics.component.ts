import { LoadingController, ModalController } from '@ionic/angular';
import { HandController } from './../@scripts/HandController';
import { Component, OnInit } from '@angular/core';
import { FunctionGlobal } from '../@scripts/global';
import { YoutubeController } from '../@scripts/YoutubeController';
import { StorageController } from '../@scripts/StorageController';
import { Config } from '../@scripts/config';
import { SettingsPage } from '../settings/settings.page';
import * as $ from 'jquery';

declare global {
  interface Window {
    listMusicsPage: any
  }
}

type itemListYt = {
  name: string,
  url: string,
  image: string,
  author: string
};


@Component({
  selector: 'app-list-musics',
  templateUrl: './list-musics.component.html',
  styleUrls: ['./list-musics.component.scss'],
})
export class ListMusicsComponent implements OnInit {
  constructor(
    public fglobal: FunctionGlobal,
    public handController: HandController,
    public youtubeController: YoutubeController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public storageController: StorageController,
    public config: Config
  ) { }

  public itemsList: itemListYt[] = [];
  public itemsListYT: itemListYt[] = [];

  ngOnInit() {
    window.listMusicsPage = this;
    var elementStyle = document.createElement('style');
    elementStyle.append(`::-webkit-scrollbar { width: unset; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { border-radius: 4px; background: var(--ion-color-primary); border: 1px solid var(--ion-color-primary); } ::-webkit-scrollbar-thumb:hover { background: rgba(var(--ion-color-primary-rgb), .6); border: 1px solid rgba(var(--ion-color-primary-rgb), .6); }`);
    document.querySelector("ion-content.list-musics-page-content").shadowRoot.append(elementStyle);
    for (let index = 0; index < 25; index++) {
      var elem = $('ion-list.list-musics div.loading ion-item.loading-element.clone').clone().removeClass('clone');
      $('ion-list.list-musics div.loading').append(elem);
    }
    this.updateList();
    this.updateListYoutube();
  }

  async updateList() {
    await this.cleanList();
    $('ion-content.list-musics-page-content ion-list.list-musics div.loading').show();
    var config = await this.config.getConfig();
    var list = (config.storage == true)? await this.storageController.getPlayList() : await this.youtubeController.getPlayList();
    this.itemsList = list;
    this.fglobal.itemsList = this.itemsList;
    $.each(list, (index: number, value: itemListYt)=>{
      var element = $('ion-list.list-musics ion-item.clone').not('ion-list.list-musics div.loading ion-item.loading-element.clone').clone().removeClass('clone');
      element.find('ion-label h3').html(value.name);
      element.find('ion-label p').html(value.author);
      element.addClass('element-list');
      element.click(()=>this.fglobal.playMusic(value.url, value.image, config.storage, index));
      $('ion-content.list-musics-page-content ion-list.list-musics').append(element);
    });
    $('ion-content.list-musics-page-content ion-list.list-musics div.loading').hide();
    return true;
  }

  async updateListYoutube() {
    var list = await this.youtubeController.getPlayList();
    return this.itemsListYT = list;
  }

  async cleanList(): Promise<boolean> {
    $('ion-content.list-musics-page-content ion-list.list-musics ion-item.element-list').not('ion-content.list-musics-page-content ion-list.list-musics div.loading').each((index: number, elem: Element)=>{
      $(elem).remove();
    });
    return true;
  }


  async actionPower() {
    if (this.handController.ifStart == false) {
      var loading = await this.loadingController.create({ message: 'Encendiendo el sistema...', cssClass: 'custom-loading' });
      await loading.present();
      await this.handController.start();
      setTimeout(async()=>await loading.dismiss(), 5000);
      $('ion-footer ion-button.button-power ion-icon').attr('name', 'pause-circle-outline');
    } else {
      var loading = await this.loadingController.create({ message: 'Apagando el sistema...', cssClass: 'custom-loading' });
      await loading.present();
      await this.handController.stop();
      await loading.dismiss();
      $('ion-footer ion-button.button-power ion-icon').attr('name', 'play-circle-outline');
    }
  }

  async openSetting() {
    const modal = await this.modalController.create({
      component: SettingsPage,
      cssClass: 'setting-view'
    });
    return await modal.present();
  }

  hideList() { return this.fglobal.actionList(); }
}
