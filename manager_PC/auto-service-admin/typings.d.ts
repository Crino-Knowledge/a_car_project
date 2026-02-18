/// <reference types="umi" />
/// <reference types="umi/typings" />
/// <reference types="@umijs/plugins/dist/dva" />
/// <reference types="@umijs/plugins/dist/antd" />
/// <reference types="@umijs/plugins/dist/access" />
/// <reference types="@umijs/plugins/dist/initial-state" />

declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

declare namespace API {
  interface CurrentUser {
    id?: number;
    username?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
  }

  interface LoginResult {
    token: string;
    user: CurrentUser;
  }

  interface PageParams {
    current?: number;
    pageSize?: number;
  }

  interface PageResult<T> {
    list: T[];
    total: number;
    current: number;
    pageSize: number;
  }
}
