import { EmojiFlavor } from '@grammyjs/emoji';
import { FileFlavor } from '@grammyjs/files';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { ParseModeFlavor } from '@grammyjs/parse-mode';
import { Context, SessionFlavor } from 'grammy';
import { LoggerFlavor } from '../middlewares/with-logger';
import { AwilixFlavor } from '../middlewares/awilix';
import { DiCradle } from '../../../di-container';

export type IBotCommonCtx<T> = FileFlavor<
  ParseModeFlavor<
    EmojiFlavor<
      HydrateFlavor<
        Context & I18nFlavor & LoggerFlavor & AwilixFlavor<DiCradle>
      >
    >
  >
> &
  SessionFlavor<T>;
