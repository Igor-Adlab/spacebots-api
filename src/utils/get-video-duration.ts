import axios from 'axios';
import { accessSync } from 'fs';
import { open, stat } from 'fs/promises';
import * as mime from 'mime-types';
import { logger } from '../logger';
import { parse } from 'url';

const log = logger.child({ fn: 'getVideoDuration' });

export function processVideoBuffer(buffer: Buffer) {
  const header = Buffer.from('mvhd');
  const start = buffer.indexOf(header) + 16;
  const timeScale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);

  let lengthSeconds = Math.floor(duration / timeScale);
  let lengthMS = Math.floor((duration / timeScale) * 1000);

  const data = {
    ms: lengthMS,
    seconds: lengthSeconds,
    timeScale: timeScale,
    duration: duration,
  };

  log.info(`Fetched duration: ${JSON.stringify(data)}`);

  return data;
}

export function isVideoFile(filePath) {
  const mimeType = mime.lookup(filePath);

  return mimeType && mimeType.startsWith('video/');
}

export function isURL(input) {
  const parsedUrl = parse(input);
  return (
    parsedUrl.protocol &&
    (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:')
  );
}

export function fileExists(filePath) {
  try {
    accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getVideoDuration(video) {
  log.info(`Started fetching duration for ${video}`);

  if (isURL(video)) {
    try {
      // Download video from the URL
      const response = await axios.get(video, {
        responseType: 'arraybuffer',
        responseEncoding: 'binary', // Add this line for Node.js
      });

      // Status
      if (response.status !== 200) {
        throw new Error(
          `Failed to download the video from the URL: HTTP ${response.status}`
        );
      }

      const contentType: string = response.headers['content-type'];

      if (
        (contentType && contentType.startsWith('video/')) ||
        contentType.includes('octet-stream')
      ) {
        // The response has a video MIME type
        const videoBuffer = await response.data;

        // Proceed with processing the video buffer
        return processVideoBuffer(videoBuffer);
      } else {
        throw new Error('The url is not a video.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        throw new Error(`Axios Error: ${error}`);
      } else {
        // Handle other errors
        throw new Error(`Error: ${error.message}`);
      }
    }
  } else if (isVideoFile(video) && fileExists(video)) {
    const { size } = await stat(video);
    const buff = Buffer.alloc(size);
    const file = await open(video, 'r');

    const { buffer } = await file.read({
      buffer: buff,
      length: size,
      offset: 0,
      position: 0,
    });

    await file.close();

    return processVideoBuffer(buffer);
  } else {
    throw new Error('Invalid video file/url/path');
  }
}
