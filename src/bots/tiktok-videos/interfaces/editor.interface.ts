export enum Template {
  Popup = 'popup',
  Split = 'split',
  Reaction = 'reaction',
}

export enum BackdropType {
  Cookin = 'cooking',
  Cleaning = 'cleaning',
  Minecraft = 'minecraft',
  GtaParkour = 'gta-parkour',
  CarpetsCleaning = 'carpets-cleaning',
}

export enum VerticalPosition {
  Top = 'top',
  Center = 'center',
  Bottom = 'bottom',
}

export enum HorizontalPosition {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

export interface IEditor extends Record<string, any> {
  template: Template;

  duration: number;

  videoUrl: string;
  backdropTypeId: string;
  backdropVideoUrl?: string;

  // If user audio exists
  audioUrl?: string;

  // Pre-post roll
  preRollVideoUrl?: string;
  preRollVideoDuration?: number;

  postRollVideoUrl?: string;
  postRollVideoDuration?: number;

  // Audio settings
  mainVideoVolume: number;
  customAudioVolume?: number;
  backdropVideoVolume: number;

  //
  backdropStart?: number;

  // Callback payload
  chatId: number;
  isPaid?: boolean;
  language: string;
  messageId: number;

  // Callbacks
  onErrorCallbackUrl: string;
  onSuccessCallbackUrl: string;
  onProgressCallbackUrl: string;
}

export interface IBackdropProcessorOptions {
  backdropUrl: string;
  backdropStartAt: number;
}

export interface SplitOptions {
  ratio: [number, number];
  template: Template.Split;
  position: VerticalPosition.Top | VerticalPosition.Bottom;
}

export interface PopupOptions {
  template: Template.Popup;
  position: VerticalPosition;
}

export interface ReactionOptions {
  scale: number;
  reactionVideoUrl: string;
  template: Template.Reaction;
  position: [VerticalPosition, HorizontalPosition];
}

export type SplitEditor = IEditor & SplitOptions;
export type PopupEditor = IEditor & PopupOptions;
export type ReactionEditor = IEditor & ReactionOptions;

export type Editor = SplitEditor | PopupEditor | ReactionEditor;

// Webhooks
export type CommonWebhookPayload = {
  chatId: number;
  language: string;
  messageId: number;
};

export type ProgressWebhooksPayload = CommonWebhookPayload & {
  progress: number;
};
export type SuccessWebhooksPayload = CommonWebhookPayload & {
  isPaid?: boolean;
  duration: number;
  resultVideoUrl: string;
};
export type ErrorWebhooksPayload = CommonWebhookPayload & {
  error: string;
  stacktrace?: string[];
};
