import { emoji } from '@grammyjs/emoji';
import { Menu, type MenuFlavor, MenuRange } from '@grammyjs/menu';
import { Editor, ITikTokVideosBotContext } from '../interfaces';
import { backToEditorRange } from './back-to-editor.range';

enum VolumeType {
  MainVideoVolume = 'mainVideoVolume',
  CustomAudioVolume = 'customAudioVolume',
  BackdropVideoVolume = 'backdropVideoVolume',
}

const icons: Record<VolumeType, string> = {
  customAudioVolume: emoji('microphone'),
  backdropVideoVolume: emoji('framed_picture'),
  mainVideoVolume: emoji('speaker_high_volume'),
};

export const soundSettingsMenu = new Menu<ITikTokVideosBotContext>(
  'sound_settings'
);

soundSettingsMenu.dynamic((ctx) => buildSoundSettingsMenu(ctx));

function buildSoundSettingsMenu(ctx: ITikTokVideosBotContext) {
  const range = new MenuRange<ITikTokVideosBotContext>();
  const editor = ctx.session.editor!;

  const hasCustomAudio = !!editor.audioUrl;

  // Append controls for main volume
  appendKeys(range, editor, VolumeType.MainVideoVolume).row();

  // Append controls for backdrop volume
  appendKeys(range, editor, VolumeType.BackdropVideoVolume).row();

  if (hasCustomAudio) {
    appendKeys(range, editor, VolumeType.CustomAudioVolume).row();
  }

  // Back button
  range.append(backToEditorRange);

  return range;
}

function getMenuLabel(editor: Editor, type: VolumeType, volumeLevel: number) {
  const current = editor[type];
  let icon = volumeLevel == 0 ? icons[type] : '';
  if (current === volumeLevel) {
    icon = emoji('green_circle');
  }

  return () => `${icon} ${volumeLevel}%`;
}

function getMenuButtonHandler(
  editor: Editor,
  type: VolumeType,
  volumeLevel: number
) {
  return async (ctx: ITikTokVideosBotContext & MenuFlavor) => {
    const current = editor[type];
    if (current === volumeLevel) {
      return;
    }

    editor[type] = volumeLevel;

    await ctx.menu.update();
    await ctx.editMessageText(
      ctx.t('tiktok_videos_message_editor_sound_settings')
    );
  };
}

function appendKeys(
  menu: MenuRange<ITikTokVideosBotContext>,
  editor: Editor,
  type: VolumeType
) {
  for (let i = 0; i <= 100; i = i + 25) {
    menu.text(
      getMenuLabel(editor, type, i),
      getMenuButtonHandler(editor, type, i)
    );
  }

  return menu;
}
