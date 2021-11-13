import { Injectable } from '@angular/core';
import * as $ from 'jquery';

declare global {
    interface Window {
        SpectrumController: any,
        fglobal: any
    }
}

@Injectable()
export class AudioController {
    constructor() {}

    public audio: HTMLAudioElement = new Audio();
    public intervalUpdate: (ReturnType<typeof setInterval> | undefined) = undefined;
    public elements: { action: (HTMLElement | undefined), forward: (HTMLElement | undefined), backward: (HTMLElement | undefined), slide: (HTMLElement | undefined), progress: (HTMLElement | undefined), loading: (HTMLElement | undefined) } = { action: undefined, forward: undefined, backward: undefined, slide: undefined, progress: undefined, loading: undefined };

    async audioAction(): Promise<String> {
        return new Promise((resolve)=>{
            if (this.audio.src == '') return resolve('stop');
            if (this.audio.paused == true) {
                this.audio.play();
                return resolve('play');
            } else {
                this.audio.pause();
                return resolve('pause');
            }
        });
    }
    playerPlay(src: string): boolean {
        try {
            clearInterval(this.intervalUpdate);
            this.audio.pause();
            this.audio.src = src;
            this.audio.play();
            this.intervalUpdate = setInterval(()=>{
                $(this.elements.progress).html(`${this.convertSecondsToTime(this.audio.currentTime)} / ${this.convertSecondsToTime(this.audio.duration)}`);
                $(this.elements.slide).attr('value', String(this.convertToProgress(this.audio.duration, this.audio.currentTime)));
            }, 100);
            return true;
        } catch {
            return false;
        }
    }


    /* ###### Events ###### */
    controlsEvents() {
        $(this.elements.slide).on('mouseup', (event: JQuery.Event)=>{
            var slide: any = $(this.elements.slide).find('input').val();
            var position: number = this.convertToTime(slide, this.audio.duration);
            this.audio.currentTime = position;
            this.intervalUpdate = setInterval(()=>{
                $(this.elements.progress).html(`${this.convertSecondsToTime(this.audio.currentTime)} / ${this.convertSecondsToTime(this.audio.duration)}`);
                $(this.elements.slide).attr('value', String(this.convertToProgress(this.audio.duration, this.audio.currentTime)));
            }, 100);
        });
        $(this.elements.slide).on('mousedown', (event: JQuery.Event)=>{ clearInterval(this.intervalUpdate); });
        $(this.elements.action).click(async()=>{ await this.audioAction(); });
    }
    playerEvents() {
        $(this.audio).on('play', (event: JQuery.Event)=>{
			$(this.elements.action).find('ion-icon').attr('name', 'pause-outline');
		});
		$(this.audio).on('pause', (event: JQuery.Event)=>{
			$(this.elements.action).find('ion-icon').attr('name', 'play-outline');
		});
		$(this.audio).on('error', (event: JQuery.Event)=>{
			$(this.elements.action).find('ion-icon').attr('name', 'stop-outline');
		});
		$(this.audio).on('playing', (event: JQuery.Event)=>{
			$(this.elements.action).find('ion-icon').attr('name', 'pause-outline');
			$(this.elements.loading).hide();
		});
		$(this.audio).on('ended', (event: JQuery.Event)=>{
			//$(this.elements.action).find('ion-icon').attr('name', 'repeat-outline');
            window.fglobal?.forwardSong();
		});
		$(this.audio).on('loadstart', (event: JQuery.Event)=>{
			$(this.elements.loading).show();
		});
		$(this.audio).on('loadeddata', (event: JQuery.Event)=>{
			if (window.SpectrumController.ready == false) {
                window.SpectrumController.init();
            }
		});
		$(this.audio).on('waiting', (event: JQuery.Event)=>{
			$(this.elements.loading).show();
		});
    }

    /* ###### Functions ###### */
    convertToProgress(total: number, current: number): number {
        return parseFloat(Math.fround((current * 100) / total).toFixed(2));
    }
    convertToTime(progress: number, total: number): number {
        return parseInt(Math.fround((progress * total) / 100).toFixed(0));
    }
    convertSecondsToTime(time: number): string {
        var hours: string = (String(Math.floor(time / 3600)).length == 1)? `0${String(Math.floor(time / 3600))}` : String(Math.floor(time / 3600));
        var minutes: string = (String(Math.floor((time / 60) % 60)).length == 1)? `0${String(Math.floor((time / 60) % 60))}` : String(Math.floor((time / 60) % 60));
        var seconds: string = (String(Math.trunc(Math.floor(time % 60))).length == 1)? `0${String(Math.trunc(Math.floor(time % 60)))}` : String(Math.trunc(Math.floor(time % 60)));
        return (hours == '00')? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
    }
}