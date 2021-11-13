import { Injectable } from "@angular/core";
import * as path from 'path';
import * as fs from 'fs';
import * as remote from '@electron/remote';
import * as $ from 'jquery';

declare global {
    interface Window {
        listMusicsPage: any,
        storageController: any,
        fglobal: any
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

@Injectable()
export class Config {
    constructor() {
        if (localStorage.getItem('config') !== null) {
            this.setConfig(JSON.parse(localStorage.getItem('config')), false);
            setTimeout(async()=>{
                var webcams = await this.getWebcams();
                if (webcams.length == 0) {
                    this.globalConfig.webcamId = undefined;
                } else {
                    var find: boolean = false;
                    $.each(webcams, (index: number, value: MediaDeviceInfo)=>{
                        if (value.deviceId == this.globalConfig.webcamId) find = true;
                    });
                    if (find == false) {
                        this.globalConfig.webcamId = webcams[0].deviceId;
                        return this.setConfig(this.globalConfig, true);
                    }
                }
            }, 8);
            setTimeout(()=>{
                if (this.globalConfig.storage == true && !fs.existsSync(path.resolve(remote.app.getPath('music'), 'final-project', 'playlist.json'))) {
                    this.globalConfig.storage = false;
                    this.setConfig(this.globalConfig, true);
                    return window.listMusicsPage.updateList();
                }
            }, 8);
        }
    }
    public globalConfig: config = {
        fps: 60,
        resolution: {
            width: 640,
            height: 480
        },
        playlist: 'https://www.youtube.com/playlist?list=PLsx51Wz1j1HxYWYDVs92lhZCN_795ikX9',
        colors: true,
        storage: false,
        webcamId: undefined
    };

    setConfig(config: config, save: boolean) {
        if (this.globalConfig.playlist != config.playlist) { window.listMusicsPage?.updateList(); }
        if (this.globalConfig.storage != config.storage) {
            window.listMusicsPage?.updateListYoutube();
            window.listMusicsPage?.updateList().then(()=>{
                if (config.storage == true) {
                    window.storageController?.goActionDownload(window.listMusicsPage?.itemsListYT);
                }
            });
        }
        if (config.colors == false) { window.fglobal?.setDefaultColors(); }
        this.globalConfig = config;
        if (save == true) localStorage.setItem('config', JSON.stringify(config));
    }

    async getConfig(): Promise<config> {
        var devices = await this.getWebcams();
        var webcam: string = (this.globalConfig.webcamId == undefined)? devices[0].deviceId : this.globalConfig.webcamId;
        this.globalConfig.webcamId = webcam;
        return this.globalConfig;
    }

    async getWebcams(): Promise<MediaDeviceInfo[]> {
        return new Promise((resolve)=>{
            navigator.mediaDevices.enumerateDevices().then((devices)=>{
                var webcams: MediaDeviceInfo[] = [];
                devices.forEach((value)=>{
                    if (value.kind == 'videoinput') {
                        webcams.push(value);
                    }
                });
                return resolve(webcams);
            });
        });
    }
}