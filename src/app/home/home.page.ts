import { SpectrumController } from './../@scripts/SpectrumController';
import { AudioController } from './../@scripts/AudioController';
import { Component } from '@angular/core';
import { FunctionGlobal } from '../@scripts/global';
import * as $ from 'jquery';

declare global {
  interface Window {
    audioComponent: HTMLAudioElement,
    SpectrumController: any
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    public fglobal: FunctionGlobal,
    public audioController: AudioController,
    public spectrumController: SpectrumController
  ) {}

  public hiddenVolume: any = undefined;

  ngOnInit() {
    $('ion-card#view-content-video').on('mouseover', (event)=>{
      $('ion-card#view-content-video ion-card.volume-slide').css('opacity', '1');
    });
    $('ion-card#view-content-video').on('mouseout', (event)=>{
      $('ion-card#view-content-video ion-card.volume-slide').css('opacity', '0');
    });
    window.SpectrumController =  this.spectrumController;
    this.startPlayer();
  }
  startPlayer() {
    this.audioController.elements.action = document.querySelector('ion-footer.player-music #button-play-audio');
    this.audioController.elements.forward = document.querySelector('ion-footer.player-music #button-forward-audio');
    this.audioController.elements.backward = document.querySelector('ion-footer.player-music #button-backward-audio');
    this.audioController.elements.slide = document.querySelector('ion-footer.player-music #slide-control-audio');
    this.audioController.elements.progress = document.querySelector('ion-footer.player-music #duration-control-audio');
    this.audioController.elements.loading = document.querySelector('ion-footer.player-music #loading-control-audio');
    this.audioController.playerEvents();
    this.audioController.controlsEvents();
    this.audioController.audio.crossOrigin = 'anonymous';
    window.audioComponent = this.audioController.audio;
    $('body').append(this.audioController.audio);
    this.audioController.audio.addEventListener('volumechange', ()=>{
      clearTimeout(this.hiddenVolume);
      var volume = (this.audioController.audio.volume * 100).toFixed(2);
      $('ion-card.volume-slide ion-range').attr('value', volume);
      $('ion-card#view-content-video ion-card.volume-slide').css('opacity', '1');
      return this.hiddenVolume = setTimeout(()=>$('ion-card#view-content-video ion-card.volume-slide').css('opacity', '0'), 500);
    });
    $('ion-card.volume-slide ion-range').attr('value', (this.audioController.audio.volume * 100).toFixed(2));
  }

  backward() { return this.fglobal.backwardSong(); }
  forward() { return this.fglobal.forwardSong(); }
  changeVolume($event: any) {
    var volume = ($event.detail.value / 100);
    this.audioController.audio.volume = volume;
  }
  showList() { return this.fglobal.actionList(); }
}
