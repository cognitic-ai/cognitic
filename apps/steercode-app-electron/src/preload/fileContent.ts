import { IFileContentItem } from 'cognitic-models';
import * as fs from 'fs';
import * as path from 'path';

class LoadFileError extends Error {
  filePath: string;

  constructor(message: string, filePath: string) {
    super(message);
    this.message = message;
    this.filePath = filePath;
    this.name = 'LoadFileError';
    this.stack = new Error().stack;
  }
}

const loadFileContent = async (filePath: string): Promise<IFileContentItem> => {
  // TODO: handle binary files
  if (/\.(png|jpe?g|gif|bmp|webp|svg|mp4|mp3|log|lock|)$/i.test(filePath)) {
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: 'Content Ignored\n'
    };
  }
  try {
    const content = await fs.readFileSync(filePath, { encoding: 'utf8' });
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: content
    };
  } catch (error: any) {
    throw new LoadFileError(error?.message, filePath);
  }
};

export const getContentsForFiles = async (paths: string[]) => {
  const promises = paths.map(loadFileContent);
  const contents = await Promise.allSettled(promises);

  const files: IFileContentItem[] = [];

  contents.forEach((content) => {
    if (content.status === 'fulfilled') {
      files.push(content.value);
    } else {
      console.warn(
        `There was an error loading content for file: ${content.reason}`
      );
    }
  });

  return files;
};
