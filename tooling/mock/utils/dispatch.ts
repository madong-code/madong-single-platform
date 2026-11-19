import { defineEventHandler, getQuery, readBody } from 'h3';

import routes from '~/handlers';
import { RAW } from '~/handlers/types';
import type { RouteDef } from '~/handlers/types';

import { currentUser } from './admin/auth';
import { failWith, ok } from './admin/response';

interface PathAlias {
  method: RouteDef['method'];
  path: string;
  toMethod?: RouteDef['method'];
  toPath: string;
  /** 别名接口是否免登录 */
  public?: boolean;
}

/**
 * platform 前端 auth/站点路径 → 现有 handler pattern 的别名。
 * 前端改造后用 /login* 与 /auth/* 语义，handlers 沿用了后端注解的
 * /system/auth/* 路径，这里做归一化，避免重复注册 handler。
 */
const PLATFORM_ALIASES: PathAlias[] = [
  { method: 'POST', path: '/login', toPath: '/auth/login', public: true },
  { method: 'POST', path: '/login/logout', toPath: '/auth/logout', public: true },
  {
    method: 'POST',
    path: '/login/refresh-token',
    toMethod: 'GET',
    toPath: '/system/auth/refresh-token',
    public: true,
  },
  { method: 'GET', path: '/login/site-info', toPath: '/auth/site-info', public: true },
  { method: 'GET', path: '/auth/user-info', toPath: '/system/auth/user-info' },
  { method: 'PUT', path: '/auth/user-info', toPath: '/auth/profile' },
  { method: 'GET', path: '/auth/menus', toPath: '/auth/platform-menus' },
  { method: 'GET', path: '/auth/permissions', toPath: '/system/auth/perm-code' },
  { method: 'PUT', path: '/auth/password', toPath: '/auth/profile/password' },
];

/**
 * 生成 mock 分发事件处理器。
 * @param prefix 该路由文件负责的 URL 前缀（/platformapi 或 /adminapi）
 * @param applyAliases 是否套用 platform 前端路径别名（仅 /platformapi 需要）
 */
export function createDispatchHandler(
  prefix: string,
  applyAliases = false,
) {
  return defineEventHandler(async (event) => {
    const path = event.path.split('?')[0] ?? '';
    if (!path.startsWith(`${prefix}/`)) return;

    const originalMethod = event.method as RouteDef['method'];
    let method = originalMethod;
    let cleanPath = path.slice(prefix.length) || '/';

    if (applyAliases) {
      const alias = PLATFORM_ALIASES.find(
        (a) => a.method === method && a.path === cleanPath,
      );
      if (alias) {
        cleanPath = alias.toPath;
        if (alias.toMethod) method = alias.toMethod;
      } else if (cleanPath === '/system/user' || cleanPath.startsWith('/system/user/')) {
        // 前端 /system/user CRUD 与 mock 的 /system/admin 共用 ADMIN_USERS 数据集
        cleanPath = cleanPath.replace('/system/user', '/system/admin');
      } else if (cleanPath === '/generator/code' || cleanPath.startsWith('/generator/code/')) {
        // 前端 /generator/code 对应 mock 的 /codegen/generator/code
        cleanPath = cleanPath.replace('/generator/code', '/codegen/generator/code');
      }
      // 前端 BaseService 用 chang-status，crudRoutes 注册为 change-status
      if (cleanPath.endsWith('/chang-status')) {
        cleanPath = `${cleanPath.slice(0, -'/chang-status'.length)}/change-status`;
      }
    }

    const segments = cleanPath.split('/').filter(Boolean);
    const query = getQuery(event) as Record<string, any>;

    // multipart 请求不能 readBody（会破坏流），body 置空由处理器自行解析
    const contentType = event.headers.get('content-type') ?? '';
    const isMultipart = contentType.includes('multipart/form-data');
    let body: Record<string, any> = {};
    if (!isMultipart && originalMethod !== 'GET') {
      try {
        const raw = await readBody(event);
        body = raw ?? {};
      } catch {
        body = {};
      }
    }

    // 刷新令牌：前端走 POST body，而 handler 从 query 读取；此处兼容注入
    if (cleanPath === '/system/auth/refresh-token' && body.refresh_token && !query.refresh_token) {
      query.refresh_token = body.refresh_token;
    }

    const aliasPublic =
      applyAliases &&
      PLATFORM_ALIASES.some(
        (a) => a.public && a.method === method && a.toPath === cleanPath,
      );

    for (const def of routes) {
      if (def.method !== method) continue;
      const parts = def.pattern.split('/').filter(Boolean);
      if (parts.length !== segments.length) continue;

      const params: string[] = [];
      let matched = true;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith(':')) {
          params.push(decodeURIComponent(segments[i] ?? ''));
        } else if (parts[i] !== segments[i]) {
          matched = false;
          break;
        }
      }
      if (!matched) continue;

      const user = def.public || aliasPublic
        ? (currentUser(event) ?? ({} as any))
        : currentUser(event);
      if (!def.public && !aliasPublic && !user) {
        return failWith(event, '登录失效，请重新登录', 401);
      }

      const result = await def.handler({
        event,
        query,
        body,
        params,
        user: user as any,
      });

      // 处理器已自行输出（SSE/文件流）
      if (result === RAW) return undefined;
      // 处理器已返回完整信封（{code, msg, data} 三字段齐全）
      const isEnvelope =
        result &&
        typeof result === 'object' &&
        'code' in result &&
        'msg' in result &&
        'data' in result;
      if (isEnvelope) {
        return result;
      }
      return ok(result ?? null);
    }

    return failWith(event, `接口不存在: ${method} ${cleanPath}`, 404);
  });
}
