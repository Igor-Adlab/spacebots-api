import {
  Editor,
  HorizontalPosition,
  IEditor,
  PopupOptions,
  ReactionOptions,
  SplitOptions,
  Template,
  VerticalPosition,
} from './interfaces';

export const EDITOR_DEFAULTS: Omit<
  IEditor,
  'template' | 'videoUrl' | 'duration'
> = {
  mainVideoVolume: 100,
  customAudioVolume: 100,
  backdropVideoVolume: 50,
  backdropTypeId: process.env['BACKDROP_DEFAULT_TYPE_ID']!,
};

export const SPLIT_EDITOR_DEFAULTS: Omit<SplitOptions, 'template'> = {
  ratio: [50, 50],
  position: VerticalPosition.Top,
};

export const POPUP_EDITOR_DEFAULTS: Omit<PopupOptions, 'template'> = {
  position: VerticalPosition.Center,
};

export const REACTION_EDITOR_DEFAULTS: Omit<
  ReactionOptions,
  'template' | 'reactionVideoUrl'
> = {
  position: [VerticalPosition.Bottom, HorizontalPosition.Center],
  scale: 50,
};

export function assignDefaults(
  current: Partial<Editor>,
  template?: Template
): Editor {
  const result: Partial<Editor> = {
    template: Template.Split,
    mainVideoVolume: 100,
    customAudioVolume: 100,
    backdropVideoVolume: 100,
  };

  switch (template || current.template) {
    case Template.Popup:
      Object.assign(result, POPUP_EDITOR_DEFAULTS);
      break;
    case Template.Split:
      Object.assign(result, SPLIT_EDITOR_DEFAULTS);
      break;
    case Template.Reaction:
      Object.assign(result, REACTION_EDITOR_DEFAULTS);
      break;
  }

  Object.assign(result, current);

  return result as Editor;
}
