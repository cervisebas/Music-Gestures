import { Injectable } from '@angular/core';
import { YoutubeController } from './YoutubeController';
import getYouTubeID from 'get-youtube-id';
import * as remote from '@electron/remote';
import * as dl from 'download';
import * as fs from 'fs';
import * as $ from 'jquery';
import * as path from 'path';

declare global {
    interface Window {
        storageController: any
    }
};

type itemListYt = {
    name: string,
    url: string,
    image: string,
    author: string
};

@Injectable()
export class StorageController {
    constructor(
        public youtubeController: YoutubeController
    ) {
        window.storageController = this;
        if (!fs.existsSync(path.resolve(this.path, 'final-project'))) {
            fs.mkdirSync(path.resolve(this.path, 'final-project'));
        }
    }

    public path: string = remote.app.getPath('music');

    async downloadPlaylist(playlist: itemListYt[], result: (index: number, arg0: boolean, arg1: string)=>void): Promise<boolean> {
        for (let index = 0; index < playlist.length; index++) {
            this.setStatus(index, 0);
            var value = playlist[index];
            var name: string = getYouTubeID(value.url);
            var image = (this.verifyFile(`${name}.jpg`))? true : await this.goDownload(value.image, `${name}.jpg`);
            var music = (this.verifyFile(`${name}.mp3`))? true : await this.goDownload(await this.youtubeController.getMp3Music(value.url), `${name}.mp3`);
            if (image == true && music == true) {
                this.setStatus(index, 1);
                result(index, true, name);
            } else {
                this.setStatus(index, 2);
                result(index, false, name);
            }
        }
        return true;
    }

    async goActionDownload(playlist: itemListYt[]) {
        await this.disableAll();
        if (this.verifyFile('playlist.json')) await this.verifyFiles(playlist, JSON.parse(fs.readFileSync(path.resolve(this.path, 'final-project', 'playlist.json'), 'utf8')).items);
        var list: { items: itemListYt[] } = { items: [] };
        await this.downloadPlaylist(playlist, (index: number, resItem: boolean, name: string)=>{
            if (resItem) {
                var item = playlist[index];
                return list.items.push({
                    name: item.name,
                    url: path.resolve(this.path, 'final-project', `${name}.mp3`),
                    image: path.resolve(this.path, 'final-project', `${name}.jpg`),
                    author: item.author
                });
            }
        });
        this.updateJson(JSON.stringify(list));
        return setTimeout(()=>window.listMusicsPage?.updateList(), 64);
    }

    disableAll(): Promise<boolean> {
        return new Promise((resolve)=>{
            $('ion-list.list-musics ion-item.element-list').each((index: number, elem: Element)=>{
                $(elem).attr('disabled', 'true');
            });
            return resolve(true);
        });
    }

    async verifyFiles(playlist: itemListYt[], fileJson: itemListYt[]): Promise<boolean> {
        return new Promise((resolve)=>{
            $.each(fileJson, async(index1: number, value1: itemListYt)=>{
                var find: boolean = false;
                $.each(playlist, (index2: number, value2: itemListYt)=>{
                    if (value1.name == value2.name) find = true;
                });
                if (find == false) {
                    fs.unlinkSync(value1.url);
                    fs.unlinkSync(value1.image);
                }
            });
            return resolve(true);
        });
    }

    updateJson(data: string) {
        if (!fs.existsSync(path.resolve(this.path, 'final-project', 'playlist.json'))) {
            fs.writeFileSync(path.resolve(this.path, 'final-project', 'playlist.json'), data);
        } else {
            fs.unlinkSync(path.resolve(this.path, 'final-project', 'playlist.json'));
            fs.writeFileSync(path.resolve(this.path, 'final-project', 'playlist.json'), data);
        }
    }

    setStatus(index: number, status: number) {
        var elem = $('ion-list.list-musics ion-item.element-list')[index];
        switch (status) {
            case 0:
                $(elem).find('ion-icon').attr('name', 'cloud-download-outline');
                break;
            case 1:
                $(elem).find('ion-icon').attr('name', 'cloud-done-outline');
                break;
            case 2:
                $(elem).find('ion-icon').attr('name', 'cloud-offline-outline');
                break;
        }
    }

    verifyFile(name: string) {
        return (fs.existsSync(path.resolve(this.path, 'final-project', name)))? true : false;
    }

    async getPlayList(): Promise<itemListYt[]> {
        return new Promise((resolve)=>{
            var list: itemListYt[] = JSON.parse(fs.readFileSync(path.resolve(this.path, 'final-project', 'playlist.json'), 'utf8')).items;
            return resolve(list);
        });
    }

    goDownload(url: string, name: string): Promise<boolean> {
        return new Promise(async(resolve)=>{
            try {
                fs.writeFileSync(path.resolve(this.path, 'final-project', name), await dl(url));                
                return resolve(true);
            } catch {
                return resolve(false);
            }
        });
    }
}