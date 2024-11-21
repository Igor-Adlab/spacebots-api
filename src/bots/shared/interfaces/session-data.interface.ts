import { LanguageCode } from '../../../i18n';

export interface ISessionData {}

export interface ISessionDataWithLocalization extends ISessionData {
  __language_code: LanguageCode;
}
