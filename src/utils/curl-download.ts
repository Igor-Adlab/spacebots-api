import { exec } from 'child_process';

export async function curlDownload(
  url: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `curl "${url}" -L -o ${outputPath}`;

    exec(command, (error) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }

      resolve(outputPath);
    });
  });
}
