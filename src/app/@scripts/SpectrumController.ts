import { Injectable } from "@angular/core";
import { FunctionGlobal } from "./global";

declare global {
    interface Window {
        audioComponent: HTMLAudioElement,
        SpectrumController: any
    }
}

@Injectable()
export class SpectrumController {
    constructor(
        public fglobal: FunctionGlobal
    ) {}
    public elements: { canvas: (HTMLCanvasElement | undefined), ctx: (CanvasRenderingContext2D | undefined) } = { canvas: undefined, ctx: undefined };
    public analyser: (AnalyserNode | undefined) = undefined;
    public ready: boolean = false;

    init() {
        this.ready = true;
        this.elements.canvas = document.querySelector('canvas#canvas-spectrum');
        this.elements.ctx =  this.elements.canvas.getContext('2d');
        var context: AudioContext = new AudioContext();
        this.analyser = context.createAnalyser();
        var source: MediaElementAudioSourceNode = context.createMediaElementSource(window.audioComponent);
        source.connect(this.analyser);
        this.analyser.connect(context.destination);
        this.frameLooper();
    }
    frameLooper() {
        window.requestAnimationFrame(window.SpectrumController.frameLooper);
        var fbc_array: Uint8Array = new Uint8Array(window.SpectrumController.analyser.frequencyBinCount);
        window.SpectrumController.analyser.getByteFrequencyData(fbc_array);
        window.SpectrumController.elements.ctx.clearRect(0, 0, window.SpectrumController.elements.canvas.width, window.SpectrumController.elements.canvas.height);
        window.SpectrumController.elements.ctx.fillStyle = window.SpectrumController.fglobal.actualColors.hex;
        var bars: number = 100;
        for (let i = 0; i < bars; i++) {
            var barX: number = i * 3;
            var barWidth: number = 2;
            var barHeight: number = -(fbc_array[i] / 3);
            window.SpectrumController.elements.ctx.fillRect(barX, window.SpectrumController.elements.canvas.height, barWidth, barHeight);
        }
    }
}