import { FunctionGlobal } from './global';
import { AudioController } from './AudioController';
import { Injectable } from '@angular/core';

type gesture = {
    position: string,
    accept: boolean
};

@Injectable()
export class ActionGestures {
    constructor(
        private audioController: AudioController,
        private fglobal: FunctionGlobal
    ) {}

    private repeat: { accept: boolean, gesture: string, interval: any } = { accept: true, gesture: '', interval: undefined };

    async processGesture(gesture: gesture) {
        if (gesture.accept == true && this.repeat.accept == true) {
            this.repeat.accept = false;
            this.repeat.gesture = gesture.position;
            if (gesture.position == 'index_up' || gesture.position == 'index_down') this.repeat.interval == setTimeout(()=>this.repeat.accept = true, 64); else this.repeat.interval == setTimeout(()=>this.repeat.accept = true, 2000);
            switch (gesture.position) {
                case 'index_up':
                    this.controlAudioVolume(0.02);
                    break;
                case 'index_down':
                    this.controlAudioVolume(-0.02);
                    break;
                case 'index_left':
                    this.fglobal.forwardSong();
                    break;
                case 'index_right':
                    this.fglobal.backwardSong();
                    break;
                case 'ok_gesture':
                    this.audioController.audioAction();
                    break;
            }
        } else {
            if (this.repeat.gesture !== gesture.position) {
                this.repeat.accept = true;
                this.repeat.gesture = '';
                return clearTimeout(this.repeat.interval);
            }
        }
    }
    controlAudioVolume(i: number) {
        var volume: number = this.audioController.audio.volume + (i);
        if (volume <= 1 && volume >= 0) {
            return this.audioController.audio.volume = volume;
        }
    }
}