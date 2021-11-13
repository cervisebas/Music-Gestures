import { Injectable } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Config } from './config';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import * as $ from 'jquery';
import { Coords3D } from '@tensorflow-models/handpose/dist/pipeline';
import { Gestures } from './GesturesController';
import { ActionGestures } from './ActionGestures';

@Injectable()
export class HandController {
    constructor(
        public modalController: ModalController,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public actionGestures: ActionGestures,
        public config: Config
    ) {}

    public elementsDom: { video: (HTMLVideoElement | undefined), canvas: (HTMLCanvasElement | undefined) } = { video: undefined, canvas: undefined };
    public mainInterval: any = undefined;
    public stream: (MediaStream | undefined) = undefined;
    public ifStart: boolean = false;
    public varGestureProcess: { position_hand: string, hand_find: number, checker: any } = { position_hand: '', hand_find: 0, checker: 0 };


    /* ##### Handlings ##### */
    async start(): Promise<boolean> {
        return new Promise(async(resolve)=>{
            if (this.ifStart == true) { return resolve(true); }
            var content: any = $('ion-card#view-content-video');
            this.elementsDom.video = content.find('video')[0];
            this.elementsDom.canvas = content.find('canvas')[0];
            await this.initCamera(this.config.globalConfig.resolution.width, this.config.globalConfig.resolution.height, this.config.globalConfig.fps).then((result: HTMLVideoElement)=>{
                result.play();
                result.addEventListener('loadeddata', ()=>{
                    this.mainHandpose((arg0)=>console.log(arg0));
                    this.ifStart = true;
                });
                resolve(true);
            });
        });
    }
    async stop(): Promise<boolean> {
        return new Promise(async(resolve)=>{
            if (this.ifStart == false) { return resolve(true); }
            this.ifStart = false;
            this.stream.getTracks().forEach((track: MediaStreamTrack)=>{
                clearInterval(this.mainInterval);
                track.stop();
                var ctx = this.elementsDom.canvas.getContext("2d");
                ctx.clearRect(0, 0, this.config.globalConfig.resolution.width, this.config.globalConfig.resolution.height);
                this.elementsDom.video = undefined;
                this.elementsDom.canvas = undefined;
                this.stream = undefined;
                resolve(true);
            });
        });
    }
    async reset(): Promise<boolean> {
        return new Promise(async(resolve)=>{
            await this.stop();
            await this.start();
            resolve(true);
        });
    }

    /* ##### Functions ##### */
    async mainHandpose(results: (arg0: (boolean | string))=>void) {
        if (this.ifStart == true) { return results(true); }
        clearInterval(this.mainInterval);
        results('Cargando modelos, espere por favor...');
        var ctx = this.elementsDom.canvas.getContext("2d");
        var landmarkColors = { thumb: 'red', indexFinger: 'blue', middleFinger: 'yellow', ringFinger: 'green', pinky: 'pink', palmBase: 'white' };
        const model = await handpose.load();
        this.mainInterval = setInterval(async()=>{
            ctx.clearRect(0, 0, this.config.globalConfig.resolution.width, this.config.globalConfig.resolution.height);
            const estimate = await model.estimateHands(this.elementsDom.video);
            for (let i = 0; i < estimate.length; i++) {
                for (let part in estimate[i].annotations) {
                    for(let point of estimate[i].annotations[part]) {
                        this.drawPoint(ctx, point[0], point[1], 5, landmarkColors[part]);
                    }
                }
                this.gestureProcess(estimate[0].landmarks).then((result)=>{
                    if (result !== false) {
                        var gesture: any = result;
                        this.actionGestures.processGesture(gesture);
                    }
                });
            }
        }, 1000 / this.config.globalConfig.fps);
        return results(true);
    }
    drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
    async initCamera(width: number, height: number, fps: number) {
        var configs = await this.config.getConfig();
        const constraints = {
            audio: false,
            video: {
                facingMode: "user",
                width: width,
                height: height,
                frameRate: {
                    max: fps
                },
                deviceId: {
                    exact: configs.webcamId
                }
            }
        };
        this.elementsDom.video.width = width;
        this.elementsDom.video.height = height;
        this.elementsDom.canvas.width = width;
        this.elementsDom.canvas.height = height;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.elementsDom.video.srcObject = stream;
        this.stream = stream;
        return new Promise((resolve)=>this.elementsDom.video.onloadedmetadata = ()=>resolve(this.elementsDom.video));
    }
    async gestureProcess(landmarks: Coords3D): Promise<(boolean | { position: string, accept: boolean })> {
        return new Promise((resolve)=>{
			const { gestures } = Gestures.estimate(landmarks, 7.5) || [];
			if (gestures.length !== 0) {
				var next: boolean = true;
				var tgesture: number = 0;
				$.each(gestures, (index: number, value: any)=>{ if (value.confidence >= 9) { tgesture++; } });
				if (tgesture >= 1) { next = true; } else { next = false; }
				if (next == true) {
					clearTimeout(this.varGestureProcess.checker);
					this.varGestureProcess.checker = setTimeout(()=>{
                        if (this.varGestureProcess.hand_find !== 0 && this.varGestureProcess.position_hand !== "") {
                            this.varGestureProcess.hand_find = 0; this.varGestureProcess.position_hand = "";
                            return resolve(false);
                        }
                    }, 500);
					$.each(gestures, (index: number, value: any)=>{
						if (value.confidence >= 9) {
							if (this.varGestureProcess.position_hand == value.name) {
								if (this.varGestureProcess.hand_find == 10) {
                                    resolve({ position: value.name, accept: true });
                                } else {
                                    this.varGestureProcess.hand_find = this.varGestureProcess.hand_find + 1;
                                    resolve({ position: value.name, accept: false });
                                }
							} else {
								this.varGestureProcess.hand_find = 1;
                                this.varGestureProcess.position_hand = value.name;
								resolve({ position: value.name, accept: false });
							}
						}
					});
				} else {
					return resolve(false);
				}
			} else {
				this.varGestureProcess.hand_find = 0; this.varGestureProcess.position_hand = "";
				resolve(false);
			}
		});
    }
}