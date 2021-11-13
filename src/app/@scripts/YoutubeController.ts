import { Injectable } from "@angular/core";
import * as remote from "@electron/remote";
import * as ytpl from 'ytpl';
import * as $ from 'jquery';
import { Config } from "./config";
import { YtResponse } from 'youtube-dl-exec';

type itemListYt = {
    name: string,
    url: string,
    image: string,
    author: string
};

@Injectable()
export class YoutubeController {
    constructor(
        private config: Config
    ) {}
    async getPlayList(): Promise<itemListYt[]> {
        var itemsList: itemListYt[] = [];
        var listYt = await ytpl(await ytpl.getPlaylistID(this.config.globalConfig.playlist));
        $.each(listYt.items, (index: number, value: ytpl.Item)=>{
            itemsList.push({
                name: value.title,
                url: value.shortUrl,
                image: value.bestThumbnail.url,
                author: value.author.name
            });
        });
        return itemsList;
    }
    async getMp3Music(url: string): Promise<string> {
        const youtubeDl = remote.require('youtube-dl-exec');
        var request: YtResponse = await youtubeDl(url, { getUrl: true, extractAudio: true, audioFormat: 'mp3' });
        return String(request);
    }
}