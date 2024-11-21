import { Logger } from 'pino';
import { JobsClient } from '@google-cloud/run';

import { env } from '../env';
import { Editor } from '../bots/tiktok-videos/interfaces';

export class CloudRunService {
  private readonly logger: Logger;
  private readonly client: JobsClient;

  constructor({ logger }) {
    this.client = new JobsClient();
    this.logger = logger.child({ service: CloudRunService.name });
  }

  async invokeVideoCaptionsJob(payload: any) {
    this.logger.info(`Invoke *Video Captions* job: ${JSON.stringify(payload)}`);
    await this.client.runJob({
      name: `projects/${env.GOOGLE_CLOUD_PROJECT}/locations/${env.GOOGLE_CLOUD_REGION}/jobs/space-renderer-job`,
      overrides: {
        containerOverrides: [
          {
            args: ['video-captions', `-i ${JSON.stringify(payload)}`],
          },
        ],
      },
    });
  }

  async invokeTikTokVideosJob(editor: Editor) {
    this.logger.info(`Invoke *TikTok Video* job: ${JSON.stringify(editor)}`);
    await this.client.runJob({
      name: `projects/${env.GOOGLE_CLOUD_PROJECT}/locations/${env.GOOGLE_CLOUD_REGION}/jobs/space-renderer-job`,
      overrides: {
        containerOverrides: [
          {
            args: [
              'tiktok-video',
              `-t ${editor.template}`,
              `-i ${JSON.stringify(editor)}`,
            ],
          },
        ],
      },
    });
  }
}
