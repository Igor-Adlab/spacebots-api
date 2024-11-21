import { emoji } from '@grammyjs/emoji';
import { Menu, MenuFlavor } from '@grammyjs/menu';

import { i18n, LanguageCode } from '../../../i18n';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';

export function createLanguageSelectionMenu(
  onBack: (ctx: IBotCommonCtx<ISessionDataWithLocalization>) => void
) {
  const menu = new Menu<IBotCommonCtx<ISessionDataWithLocalization>>(
    'language-selection'
  );

  menu
    .text(getLanguageLabel('uk'), getLanguageHandler('uk', menu))
    .text(getLanguageLabel('ru'), getLanguageHandler('ru', menu))
    .row()
    .text(getLanguageLabel('en'), getLanguageHandler('en', menu))
    .row()
    .text((ctx) => `${emoji('left_arrow')} ${ctx.t('button_back')}`, onBack);

  return menu;
}

const flags: Record<LanguageCode, string> = {
  ru: emoji('flag_russia'),
  uk: emoji('flag_ukraine'),
  en: emoji('flag_united_states'),
};

function getLanguageLabel(language: LanguageCode) {
  return async (ctx: IBotCommonCtx<ISessionDataWithLocalization>) => {
    const current = ctx.session.__language_code;
    const flag = current == language ? emoji('green_circle') : flags[language];

    return `${flag} ${ctx.t(`language_${language}`)}`;
  };
}

function getLanguageHandler(language: LanguageCode, menu: Menu) {
  return async (
    ctx: IBotCommonCtx<ISessionDataWithLocalization> & MenuFlavor
  ) => {
    if (ctx.session.__language_code === language) {
      return;
    }

    ctx.session.__language_code = language;
    await ctx.i18n.renegotiateLocale();

    await ctx.editMessageText(
      i18n.t(language, 'shared_message_language_settings'),
      {
        reply_markup: menu,
      }
    );
  };
}
