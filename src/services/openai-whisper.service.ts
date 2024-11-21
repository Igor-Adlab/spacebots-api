import { OpenAI } from 'openai';
import { env } from '../env';
import { createReadStream } from 'fs';
export class OpenAiWhisperService {
  private readonly client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async getTextFromAudio(audioPath: string) {
    try {
      const response = await this.client.audio.transcriptions.create({
        file: createReadStream(audioPath),
        model: 'whisper-1',
        response_format: 'text',
      });
      return response;
    } catch (error) {
      console.error('Error during transcription:', error);
      throw error;
    }
  }
}
