import { Injectable } from "@angular/core";
import { YoutubeController } from "./YoutubeController";
import { AudioController } from "./AudioController";
import { TinyColor } from '@ctrl/tinycolor';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { Config } from "./config";
import * as imageToBase64 from 'image-to-base64';
import * as getColors from 'get-image-colors';
import * as $ from 'jquery';
import * as url from 'url';

declare global {
    interface Window {
        fglobal: any
    }
}

type colors = {
    hex: string,
    rgb: string
};
type itemListYt = {
    name: string,
    url: string,
    image: string,
    author: string
};

@Injectable()
export class FunctionGlobal {
    constructor(
        public youtubeController: YoutubeController,
        public audioController: AudioController,
        public config: Config
    ) { window.fglobal = this; }

    public titleBar: (Titlebar | undefined) = undefined;
    public actualColors: colors = { hex: '#FFFFFF', rgb: '255, 255, 255' };
    public itemsList: itemListYt[] = [];
    public actualSong: itemListYt = { name: '', url: '', image: '', author: '' };
    public actualIndexSong: number = 0;

    actionList() {
        var status: string = $('div#list-musics').css('right');
        if (status == '0px') {
            $('div#list-musics').css({ right: '-408px' });
            setTimeout(()=>{ $('ion-fab-button#showActionList').show(450); }, 300);
        } else {
            $('ion-fab-button#showActionList').hide(450);
            setTimeout(()=>{ $('div#list-musics').css({ right: '0px' }); }, 300);
        }
    }
    async playMusic(uri: string, img: string, storage: boolean, position: number) {
        $(this.audioController.elements.loading).show();
        this.readActualSong(position);
        if (!storage) {
            this.youtubeController.getMp3Music(uri).then(async(raw: string)=>{
                this.audioController.playerPlay(raw);
                await this.setImageColors(img);
            }).catch(()=>{
                alert('Ocurrio un error inesperado.');
            });
        } else {
            imageToBase64(img).then(async(imgB64: string)=>{
                var musicsrc: url.URL = url.pathToFileURL(uri);
                this.audioController.playerPlay(musicsrc.href);
                await this.setImageColors(`data:image/jpg;base64,${imgB64}`);
            }).catch(()=>{
                this.audioController.playerPlay(uri);
            });
        }
    }
    forwardSong() {
        var position: number = (this.actualIndexSong == (this.itemsList.length - 1))? 0 :  this.actualIndexSong + 1;
        var next: itemListYt = (this.actualIndexSong == (this.itemsList.length - 1))? this.itemsList[0] :  this.itemsList[this.actualIndexSong + 1];
        return this.playMusic(next.url, next.image, this.config.globalConfig.storage, position);
    }
    backwardSong() {
        var position: number = (this.actualIndexSong == 0)? (this.itemsList.length - 1) : this.actualIndexSong - 1;
        var back: itemListYt = (this.actualIndexSong == 0)? this.itemsList[this.itemsList.length - 1] : this.itemsList[this.actualIndexSong - 1];
        return this.playMusic(back.url, back.image, this.config.globalConfig.storage, position);
    }
    readActualSong(position: number) {
        this.actualIndexSong = position;
        return this.actualSong = this.itemsList[position];
    }
    async setImageColors(img: string) {
        $('div.backgroun-wallpaper').css({ 'background': `url(${img})`, 'background-repeat': 'no-repeat', 'background-size': 'cover' });
        if (this.config.globalConfig.colors == false) return;
        var scan = await getColors(img);
        var colors: { hex: string, rgb: string }[] = scan.map((color)=>{
            var hex: string = color.hex();
            var rgb: number[] = color.rgb();
            return { hex: hex, rgb: `${String(rgb[0])}, ${String(rgb[1])}, ${String(rgb[2])}` };
        });
        var c1 = new TinyColor(colors[0].hex);
        var c2 = new TinyColor(colors[2].hex);
        var c1b = c1.getBrightness();
        var c1l = parseFloat(c1.getLuminance().toFixed(2));
        var c2b = c2.getBrightness();
        var c2l = parseFloat(c2.getLuminance().toFixed(2));
        var actualColor: colors;
        if (c1.isDark() == true && c2.isDark() == false) {
            $("body").get(0).style.setProperty('--ion-color-primary', colors[0].hex);
            $("body").get(0).style.setProperty('--ion-color-primary-rgb', colors[0].rgb);
            $("body").get(0).style.setProperty('--ion-color-secondary', colors[2].hex);
            $("body").get(0).style.setProperty('--ion-color-secondary-rgb', colors[2].rgb);
            $("body").get(0).style.setProperty('--sc-color-text', '#FFFFFF');
            $("body").get(0).style.setProperty('--sc-color-text2', '#000000');
            this.titleBar.updateBackground(Color.fromHex(colors[0].hex));
            actualColor = colors[2];
        } else if (c1.isDark() && c2.isDark()) {
            var color1: { hex: string, rgb: string } = (c1l >= 0.02 && c1l <= 0.05)? { hex: colors[0].hex, rgb: colors[0].rgb } : { hex: '#212121', rgb: '33, 33, 33' };
            var color2: { hex: string, rgb: string } = (c2l >= 0.10)? { hex: colors[2].hex, rgb: colors[2].rgb } : (c1l >= 0.4)? { hex: colors[0].hex, rgb: colors[0].rgb } : { hex: '#FFFFFF', rgb: '255, 255, 255' };
            $("body").get(0).style.setProperty('--ion-color-primary', color1.hex);
            $("body").get(0).style.setProperty('--ion-color-primary-rgb', color1.rgb);
            $("body").get(0).style.setProperty('--ion-color-secondary', color2.hex);
            $("body").get(0).style.setProperty('--ion-color-secondary-rgb', color2.rgb);
            $("body").get(0).style.setProperty('--sc-color-text', '#FFFFFF');
            $("body").get(0).style.setProperty('--sc-color-text2', '#000000');
            this.titleBar.updateBackground(Color.fromHex(color1.hex));
            actualColor = color2;
        } else if (c1.isLight() == true && c2.isLight() == false) {
            $("body").get(0).style.setProperty('--ion-color-primary', colors[0].hex);
            $("body").get(0).style.setProperty('--ion-color-primary-rgb', colors[0].rgb);
            $("body").get(0).style.setProperty('--ion-color-secondary', colors[2].hex);
            $("body").get(0).style.setProperty('--ion-color-secondary-rgb', colors[2].rgb);
            $("body").get(0).style.setProperty('--sc-color-text', '#000000');
            $("body").get(0).style.setProperty('--sc-color-text2', '#FFFFFF');
            this.titleBar.updateBackground(Color.fromHex(colors[0].hex));
            actualColor = colors[2];
        } else if (c1.isLight() && c2.isLight()) {
            var color2: { hex: string, rgb: string } = (c2l <= 0.5)? { hex: colors[2].hex, rgb: colors[2].rgb } : (c1l <= 0.6)? { hex: colors[0].hex, rgb: colors[0].rgb } : { hex: '#000000', rgb: '0, 0, 0' };
            $("body").get(0).style.setProperty('--ion-color-primary', '#C8C8C8');
            $("body").get(0).style.setProperty('--ion-color-primary-rgb', '200, 200, 200');
            $("body").get(0).style.setProperty('--ion-color-secondary', color2.hex);
            $("body").get(0).style.setProperty('--ion-color-secondary-rgb', color2.rgb);
            $("body").get(0).style.setProperty('--sc-color-text', '#000000');
            $("body").get(0).style.setProperty('--sc-color-text2', '#FFFFFF');
            this.titleBar.updateBackground(Color.fromHex('#DEDEDE'));
            actualColor = color2;
        }
        return this.actualColors = actualColor;
    }
    setDefaultColors() {
        $("body").get(0).style.setProperty('--ion-color-primary', '#212121');
        $("body").get(0).style.setProperty('--ion-color-primary-rgb', '33, 33, 33');
        $("body").get(0).style.setProperty('--ion-color-secondary', '#ab47bc');
        $("body").get(0).style.setProperty('--ion-color-secondary-rgb', '171, 71, 188');
        $("body").get(0).style.setProperty('--sc-color-text', '#FFFFFF');
        $("body").get(0).style.setProperty('--sc-color-text2', '#000000');
        this.titleBar.updateBackground(Color.fromHex('#212121'));
        return this.actualColors = { hex: '#FFFFFF', rgb: '255, 255, 255' };
    }
}