import axios, { AxiosInstance } from 'axios';
import { env } from '../env';
import { Logger } from 'pino';
import { randomUUID } from 'crypto';
import { curlDownload } from '../utils';
import { first } from 'lodash';

const QUALITY_OVERRIDES = {
  // Youtube videos
  AUDIO_QUALITY_LOW: '128 kbps',
  AUDIO_QUALITY_HIGH: '256 kbps',
  AUDIO_QUALITY_MEDIUM: '320 kbps',

  // Tiktok
  audio: 'mp3',
  watermark: 'TikTok Watermark',
  no_watermark: '480p | no watermark',
  hd_no_watermark: 'HD | no watermark',

  // Reels
  '480-480p': '480p',
};

export interface IDownloaderInfo {
  url: string;
  type: string;
  title: string;
  source: string;
  author?: string;
  error?: boolean;
  duration?: number;
  thumbnail?: string;
  medias: IDownloaderMedia[];
}

export interface IDownloaderMedia {
  url: string;
  quality: string;
  extension: string;
  thumbnail?: string;
  duration?: number;
  is_audio?: boolean;
  type: 'audio' | 'video' | 'image';

  width?: number;
  height?: number;
}

export class DownloaderService {
  private readonly logger: Logger;
  private readonly client: AxiosInstance;
  constructor({ logger }) {
    this.logger = logger.child({ service: DownloaderService.name });
    this.client = axios.create({
      baseURL: env.DOWNLOADER_BOT_RAPIDAPI_DOWNLOADER_URL,
      headers: {
        'x-rapidapi-key': env.DOWNLOADER_BOT_RAPIDAPI_KEY,
      },
    });
  }

  async getInfo(url: string): Promise<IDownloaderInfo> {
    this.logger.info(`Fetching data for ${url}`);

    try {
      const { data } = await this.client.post(`/v1/social/autolink`, {
        url,
      });

      if (!data || !data?.medias) {
        throw new Error('no media array');
      }

      for (let media of (data as IDownloaderInfo).medias) {
        media.quality = QUALITY_OVERRIDES[media.quality] ?? media.quality;
      }

      return data;
    } catch (err) {
      this.logger.error(`Can not fetch media from ${url}: `, err);
      throw err;
    }
  }

  async downloadYoutubeVideo(videoUrl: string) {
    const { medias } = await this.getInfo(videoUrl);
    const { url } =
      medias.find((item) => item.is_audio && item.type === 'video') ||
      first(medias);

    return this.saveYoutubeVideo(url);
  }

  private saveYoutubeVideo(downloadUrl: string) {
    const filePath = `/tmp/${randomUUID()}.mp4`;
    return curlDownload(downloadUrl, filePath);
  }
}
