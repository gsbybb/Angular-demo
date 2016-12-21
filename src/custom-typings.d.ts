/*
 * Custom Type Definitions
 * When including 3rd party modules you also need to include the type definition for the module
 * if they don't provide one within the module. You can try to install it with @types

npm install @types/node
npm install @types/lodash

 * If you can't find the type definition in the registry we can make an ambient/global definition in
 * this file for now. For example

declare module 'my-module' {
 export function doesSomething(value: string): string;
}

 * If you are using a CommonJS module that is using module.exports then you will have to write your
 * types using export = yourObjectOrFunction with a namespace above it
 * notice how we have to create a namespace that is equal to the function we're
 * assigning the export to

declare module 'jwt-decode' {
  function jwtDecode(token: string): any;
  namespace jwtDecode {}
  export = jwtDecode;
}

 *
 * If you're prototying and you will fix the types later you can also declare it as type any
 *

declare var assert: any;
declare var _: any;
declare var $: any;

 *
 * If you're importing a module that uses Node.js modules which are CommonJS you need to import as
 * in the files such as main.browser.ts or any file within app/
 *

import * as _ from 'lodash'

 * You can include your type definitions in this file until you create one for the @types
 *
 */

// support NodeJS modules without type definitions
declare module '*';

/*
// for legacy tslint etc to understand rename 'modern-lru' with your package
// then comment out `declare module '*';`. For each new module copy/paste
// this method of creating an `any` module type definition
declare module 'modern-lru' {
  let x: any;
  export = x;
}
*/

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;
declare var System: SystemJS;

interface SystemJS {
  import: (path?: string) => Promise<any>;
}

interface GlobalEnvironment {
  ENV: string;
  HMR: boolean;
  SystemJS: SystemJS;
  System: SystemJS;
}

interface Es6PromiseLoader {
  (id: string): (exportName?: string) => Promise<any>;
}

type FactoryEs6PromiseLoader = () => Es6PromiseLoader;
type FactoryPromise = () => Promise<any>;

type AsyncRoutes = {
  [component: string]: Es6PromiseLoader |
                               Function |
                FactoryEs6PromiseLoader |
                         FactoryPromise
};


type IdleCallbacks = Es6PromiseLoader |
                             Function |
              FactoryEs6PromiseLoader |
                       FactoryPromise ;

interface WebpackModule {
  hot: {
    data?: any,
    idle: any,
    accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
    decline(deps?: any | string | string[]): void;
    dispose(callback?: (data?: any) => void): void;
    addDisposeHandler(callback?: (data?: any) => void): void;
    removeDisposeHandler(callback?: (data?: any) => void): void;
    check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    status(callback?: (status?: string) => void): void | string;
    removeStatusHandler(callback?: (status?: string) => void): void;
  };
}


interface WebpackRequire {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(ids: string[], callback: (req: WebpackRequire) => void, chunkName?: string): void;
    context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
    keys(): string[];
}

interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}


// Extend typings
interface NodeRequire extends WebpackRequire {}
interface ErrorConstructor extends ErrorStackTraceLimit {}
interface NodeRequireFunction extends Es6PromiseLoader  {}
interface NodeModule extends WebpackModule {}
interface Global extends GlobalEnvironment  {}


declare namespace abp {

  let appPath: string;

  let pageLoadTime: Date;

  function toAbsAppPath(path: string): string;

  namespace multiTenancy {

    enum sides {

      TENANT = 1,

      HOST = 2

    }

    let isEnabled: boolean;

    let tenantIdCookieName: string;

    function setTenantIdCookie(tenantId?: number): void;

    function getTenantIdCookie(): number;

  }

  interface IAbpSession {

    readonly userId?: number;

    readonly tenantId?: number;

    readonly impersonatorUserId?: number;

    readonly impersonatorTenantId?: number;

    readonly multiTenancySide: multiTenancy.sides;

  }

  let session: IAbpSession;

  namespace localization {

    interface ILanguageInfo {

      name: string;

      displayName: string;

      icon: string;

      isDefault: boolean;

    }

    interface ILocalizationSource {

      name: string;

      type: string;

    }

    let languages: ILanguageInfo[];

    let currentLanguage: ILanguageInfo;

    let sources: ILocalizationSource[];

    let defaultSourceName: string;

    let values: { [key: string]: string };

    let abpWeb: (key: string) => string;

    function localize(key: string, sourceName: string): string;

    function getSource(sourceName: string): (key: string) => string;

    function isCurrentCulture(name: string): boolean;
  }

  namespace auth {

    let allPermissions: { [name: string]: boolean };

    let grantedPermissions: { [name: string]: boolean };

    function isGranted(permissionName: string): boolean;

    function isAnyGranted(...args: string[]): boolean;

    function areAllGranted(...args: string[]): boolean;

    let tokenCookieName: string;

    /**
     * Saves auth token.
     * @param authToken The token to be saved.
     * @param expireDate Optional expire date. If not specified, token will be deleted at end of the session.
     */
    function setToken(authToken: string, expireDate?: Date): void;

    function getToken(): string;

    function clearToken(): void;
  }

  namespace features {

    interface IFeature {

      value: string;

    }

    let allFeatures: { [name: string]: IFeature };

    function get(name: string): IFeature;

    function getValue(name: string): string;

    function isEnabled(name: string): boolean;

  }

  namespace setting {

    let values: { [name: string]: string };

    function get(name: string): string;

    function getBoolean(name: string): boolean;

    function getInt(name: string): number;

    enum settingScopes {

      Application = 1,

      Tenant = 2,

      User = 4
    }
  }

  namespace nav {

    interface IMenu {

      name: string;

      displayName?: string;

      customData?: any;

      items: IMenuItem[];

    }

    interface IMenuItem {

      name: string;

      order: number;

      displayName?: string;

      icon?: string;

      url?: string;

      customData?: any;

      items: IMenuItem[];

    }

    let menus: { [name: string]: IMenu };

  }

  namespace notifications {

    enum severity {
      INFO,
      SUCCESS,
      WARN,
      ERROR,
      FATAL
    }

    enum userNotificationState {
      UNREAD,
      READ
    }

    //TODO: We can extend this interface to define built-in notification types, like ILocalizableMessageNotificationData
    interface INotificationData {

      type: string;

      properties: any;
    }

    interface INotification {

      id: string;

      notificationName: string;

      severity: severity;

      entityType?: any;

      entityTypeName?: string;

      entityId?: any;

      data: INotificationData;

      creationTime: Date;

    }

    interface IUserNotification {

      id: string;

      userId: number;

      state: userNotificationState;

      notification: INotification;
    }

    let messageFormatters: any;

    function getUserNotificationStateAsString(userNotificationState: userNotificationState): string;

    function getUiNotifyFuncBySeverity(severity: severity): (message: string, title?: string, options?: any) => void;

    function getFormattedMessageFromUserNotification(userNotification: IUserNotification): string;

    function showUiNotifyForUserNotification(userNotification: IUserNotification, options?: any): void;

  }

  namespace log {

    enum levels {
      DEBUG,
      INFO,
      WARN,
      ERROR,
      FATAL
    }

    let level: levels;

    function log(logObject?: any, logLevel?: levels): void;

    function debug(logObject?: any): void;

    function info(logObject?: any): void;

    function warn(logObject?: any): void;

    function error(logObject?: any): void;

    function fatal(logObject?: any): void;

  }

  namespace notify {

    function info(message: string, title?: string, options?: any): void;

    function success(message: string, title?: string, options?: any): void;

    function warn(message: string, title?: string, options?: any): void;

    function error(message: string, title?: string, options?: any): void;

  }

  namespace message {

    //TODO: these methods return jQuery.Promise instead of any. fix it.

    function info(message: string, title?: string): any;

    function success(message: string, title?: string): any;

    function warn(message: string, title?: string): any;

    function error(message: string, title?: string): any;

    function confirm(message: string, callback?: (result: boolean) => void): any;

    function confirm(message: string, title?: string, callback?: (result: boolean) => void): any;

  }

  namespace ui {

    function block(elm?: any): void;

    function unblock(elm?: any): void;

    function setBusy(elm?: any, optionsOrPromise?: any): void;

    function clearBusy(elm?: any): void;

  }

  namespace event {

    function on(eventName: string, callback: (...args: any[]) => void): void;

    function off(eventName: string, callback: (...args: any[]) => void): void;

    function trigger(eventName: string): void;

  }

  interface INameValue {
    name: string;
    value?: any;
  }

  namespace utils {

    function createNamespace(root: any, ns: string): any;

    function replaceAll(str: string, search: string, replacement: any): string;

    function formatString(str: string, ...args: any[]): string;

    function toPascalCase(str: string): string;

    function toCamelCase(str: string): string;

    function truncateString(str: string, maxLength: number): string;

    function truncateStringWithPostfix(str: string, maxLength: number, postfix?: string): string;

    function isFunction(obj: any): boolean;

    function buildQueryString(parameterInfos: INameValue[], includeQuestionMark?: boolean): string;

    /**
     * Sets a cookie value for given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @param {string} value
     * @param {Date} expireDate (optional). If not specified the cookie will expire at the end of session.
     * @param {string} path (optional)
     */
    function setCookieValue(key: string, value: string, expireDate?: Date, path?: string): void;

    /**
     * Gets a cookie with given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @returns {string} Cookie value or null
     */
    function getCookieValue(key: string): string;

    /**
     * Deletes cookie for given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @param {string} path (optional)
     */
    function deleteCookie(key: string, path?: string): void;
  }

  namespace timing {

    interface IClockProvider {

      supportsMultipleTimezone: boolean;

      now(): Date;

      normalize(date: Date): Date;

    }

    interface ITimeZoneInfo {

      windows: {

        timeZoneId: string;

        baseUtcOffsetInMilliseconds: number;

        currentUtcOffsetInMilliseconds: number;

        isDaylightSavingTimeNow: boolean;

      },

      iana: {

        timeZoneId: string;

      }

    }

    const utcClockProvider: IClockProvider;

    const localClockProvider: IClockProvider;

    const unspecifiedClockProvider: IClockProvider;

    function convertToUserTimezone(date: Date): Date;

    let timeZoneInfo: ITimeZoneInfo;
  }

  namespace clock {

    let provider: timing.IClockProvider;

    function now(): Date;

    function normalize(date: Date): Date;

  }

  namespace security {

    namespace antiForgery {

      let tokenCookieName: string;

      let tokenHeaderName: string;

      function getToken(): string;
    }

  }

}