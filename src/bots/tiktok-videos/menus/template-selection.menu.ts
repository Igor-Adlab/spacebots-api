import * as _ from 'lodash';

import { emoji } from '@grammyjs/emoji';
import { Menu } from '@grammyjs/menu';

import { assignDefaults } from '../constants';
import { Template, ITikTokVideosBotContext } from '../interfaces';
import { backToEditorRange } from './back-to-editor.range';

const icons: Record<Template, string> = {
  [Template.Popup]: emoji('framed_picture'),
  [Template.Split]: emoji('up_down_arrow'),
  [Template.Reaction]: emoji('person'),
};

function getTemplateLabel(template: Template) {
  return (ctx: ITikTokVideosBotContext) => {
    const current = ctx.session.editor!.template;

    const flag = current == template ? emoji('green_circle') : icons[template];

    return `${flag} ${ctx.t(`tiktok_videos_button_template_${template}`)}`;
  };
}

function getLanguageHandler(template: Template) {
  return async (ctx: ITikTokVideosBotContext) => {
    const current = ctx.session.editor!.template;
    if (current == template) {
      return;
    }

    const editor = ctx.session.editor!;
    ctx.session.editor!.template = template;

    const data = _.pick(editor, [
      'template',
      'duration',
      'videoUrl',
      'backdropTypeId',
      'mainVideoVolume',
      'customAudioVolume',
      'backdropVideoVolume',
    ]);

    ctx.session.editor = assignDefaults(data);
    await ctx.editMessageText(
      ctx.t('tiktok_videos_message_editor_templates_info'),
      {
        reply_markup: templateSelectionMenu,
      }
    );
  };
}

export const templateSelectionMenu = new Menu<ITikTokVideosBotContext>(
  'template-selection'
)
  .text(getTemplateLabel(Template.Popup), getLanguageHandler(Template.Popup))
  .text(getTemplateLabel(Template.Split), getLanguageHandler(Template.Split))
  .row()
  .append(backToEditorRange);
