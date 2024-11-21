import { env } from '../env';
import { Logger } from 'pino';
import axios, { AxiosInstance } from 'axios';

export interface ISongInfo {
  url: string;
  name: string;
  artist: string;
  duration: string;
}

export class MusicSearchService {
  private readonly logger: Logger;
  private readonly axios: AxiosInstance;

  constructor({ logger }) {
    this.logger = logger.child({
      service: MusicSearchService.name,
    });

    this.axios = axios.create({
      baseURL: env.MUSIC_SEARCH_BOT_ZM_FM_API_URL,
    });
  }

  async find(query: string, page: number = 1): Promise<ISongInfo[]> {
    return this.axios
      .get(`/search?query=${query}&page=${page}`)
      .then(({ data }) => data)
      .catch(() => []);
  }
}
