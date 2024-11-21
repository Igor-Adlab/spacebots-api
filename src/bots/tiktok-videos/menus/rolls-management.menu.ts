import { Menu } from '@grammyjs/menu';
import { rollsManagementMessage } from '../messages/rolls-management.message';
import { ITikTokVideosBotContext } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { editorMessage } from '../messages';

export const rollManagementMenu = new Menu<ITikTokVideosBotContext>(
  'rolls-management'
);

rollManagementMenu.dynamic((ctx, range) => {
  const hasPreRoll = !!ctx.session?.editor?.preRollVideoUrl;
  const hasPostRoll = !!ctx.session.editor?.postRollVideoUrl;

  range
    .text(
      `${hasPreRoll ? emoji('check_mark') : emoji('no_entry')} Pre Roll`,
      (ctx) => {
        if (!ctx.session.editor.preRollVideoUrl) {
          return;
        }

        ctx.session.rollDeletionRequest = 'pre-roll';
        return ctx.editMessageText(
          ctx.t('tiktok_videos_message_ask_delete_roll', { type: 'Pre Roll' }),
          {
            reply_markup: rollDeletionMenu,
          }
        );
      }
    )
    .text(
      `${hasPostRoll ? emoji('check_mark') : emoji('no_entry')} Post Roll`,
      () => {
        if (!ctx.session.editor.postRollVideoUrl) {
          return;
        }

        ctx.session.rollDeletionRequest = 'post-roll';
        return ctx.editMessageText(
          ctx.t('tiktok_videos_message_ask_delete_roll', { type: 'Pre Roll' }),
          {
            reply_markup: rollDeletionMenu,
          }
        );
      }
    )
    .row()
    .text(
      `${emoji('left_arrow')} ${ctx.t('tiktok_videos_button_back_editor')}`,
      (ctx) => editorMessage(ctx)
    );
});

// Delete rolls
async function goBackToRollsManagement(ctx: ITikTokVideosBotContext) {
  await ctx.deleteMessage();
  return editorMessage(ctx, true);
}

export const rollDeletionMenu = new Menu<ITikTokVideosBotContext>(
  'roll-deletion-management'
);

rollDeletionMenu
  .text(
    (ctx) => `${emoji('check_mark')} ${ctx.t('button_yes_delete')}`,
    async (ctx) => {
      switch (ctx.session.rollDeletionRequest) {
        case 'pre-roll': {
          ctx.session.editor.preRollVideoUrl = null;
          break;
        }
        case 'post-roll': {
          ctx.session.editor.postRollVideoUrl = null;
          break;
        }
      }

      return goBackToRollsManagement(ctx);
    }
  )
  .row()
  .text(
    (ctx) => `${emoji('no_entry')} ${ctx.t('button_cancel')}`,
    async (ctx) => {
      await ctx.deleteMessage();
      return rollsManagementMessage(ctx);
    }
  );

// When new video uploaded
export const rollsSelectionMenu = new Menu<ITikTokVideosBotContext>(
  'rolls-selection'
);
async function goBackToEditor(ctx: ITikTokVideosBotContext) {
  ctx.session.rollVideoUrl = '';
  ctx.session.rollVideoDuration = 0;
  await ctx.deleteMessage();
  return editorMessage(ctx, true);
}

rollsSelectionMenu
  .text('Pre-Roll', async (ctx) => {
    const editor = ctx.session.editor!;
    if (ctx.session.rollVideoUrl) {
      editor.preRollVideoUrl = ctx.session.rollVideoUrl;
      editor.preRollVideoDuration = ctx.session.rollVideoDuration;
    }

    return goBackToEditor(ctx);
  })
  .text('Post-Roll', (ctx) => {
    const editor = ctx.session.editor!;
    if (ctx.session.rollVideoUrl) {
      editor.postRollVideoUrl = ctx.session.rollVideoUrl;
      editor.postRollVideoDuration = ctx.session.rollVideoDuration;
    }

    return goBackToEditor(ctx);
  })
  .row()
  .text(
    (ctx) => `${emoji('red_circle')} ${ctx.t('button_cancel')}`,
    (ctx) => goBackToEditor(ctx)
  );
