import type { Ctx, RouteDef } from './types';

import { crudRoutes } from './system';
import { route } from './types';
import { buildMenuTree } from '../utils/admin/menu-data';
import { failWith } from '../utils/admin/response';
import { crud, nextId, now } from '../utils/admin/store';

// ==================== 内存数据集 ====================

/** 显式带 id 的行类型，满足 crud.find 的泛型约束 */
type TenantRow = { id: number } & Record<string, any>;

const TENANTS: TenantRow[] = [
  {
    id: 1,
    name: '默认租户',
    code: 'default',
    contact_user: '张三',
    contact_phone: '13800000000',
    status: 1,
    expire_at: '2030-12-31 23:59:59',
    plan_id: 1,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 2,
    name: '示例租户',
    code: 'demo',
    contact_user: '李四',
    contact_phone: '13900000000',
    status: 1,
    expire_at: '2027-12-31 23:59:59',
    plan_id: 2,
    created_at: now(),
    updated_at: now(),
  },
];

const SUBSCRIPTIONS: TenantRow[] = [
  {
    id: 1,
    tenant_id: 1,
    plan_name: '旗舰版',
    status: 1,
    start_at: '2026-01-01 00:00:00',
    expire_at: '2030-12-31 23:59:59',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 2,
    tenant_id: 2,
    plan_name: '标准版',
    status: 1,
    start_at: '2026-01-01 00:00:00',
    expire_at: '2027-12-31 23:59:59',
    created_at: now(),
    updated_at: now(),
  },
];

const MEMBERS: TenantRow[] = [
  {
    id: 1,
    tenant_id: 1,
    username: 'tenant_admin',
    real_name: '租户管理员',
    mobile_phone: '13800000001',
    status: 1,
    is_locked: 0,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 2,
    tenant_id: 1,
    username: 'tenant_user',
    real_name: '租户成员',
    mobile_phone: '13800000002',
    status: 1,
    is_locked: 0,
    created_at: now(),
    updated_at: now(),
  },
];

const PLANS: Record<string, any>[] = [
  { id: 1, name: '标准版', code: 'standard', status: 1 },
  { id: 2, name: '旗舰版', code: 'flagship', status: 1 },
];

// ==================== 路由 ====================

const routes: RouteDef[] = [
  // 套餐下拉（供 bind-plan 使用）
  route('GET', '/tenant/plan/options', () => PLANS),

  // 账户：标准 CRUD（change-status 由 crudRoutes 生成）
  ...crudRoutes('/tenant/account', TENANTS),
  // 前端 chang-status 拼写别名
  route('PUT', '/tenant/account/:id/chang-status', ({ body, params }: Ctx) => {
    const row = crud.find(TENANTS, params[0]);
    if (!row) return null;
    if (body.field !== undefined) row[body.field] = body.value;
    else Object.assign(row, body);
    row.updated_at = now();
    return row;
  }),
  route('PUT', '/tenant/:id/bind-plan', ({ body, params }: Ctx) => {
    const row = crud.find(TENANTS, params[0]);
    if (!row) return null;
    row.plan_id = body.plan_id ?? body.id;
    row.updated_at = now();
    return row;
  }),
  route('PUT', '/tenant/:id/sync-data', ({ params }: Ctx) => {
    const row = crud.find(TENANTS, params[0]);
    if (!row) return null;
    row.synced_at = now();
    return { synced: true, tenant_id: params[0] };
  }),

  // 订阅：标准 CRUD
  ...crudRoutes('/tenant/subscription', SUBSCRIPTIONS),
  route('PUT', '/tenant/subscription/:id/authorize', ({ body, params }: Ctx) => {
    const row = crud.find(SUBSCRIPTIONS, params[0]);
    if (!row) return null;
    Object.assign(row, body, { updated_at: now() });
    return row;
  }),
  route('PUT', '/tenant/subscription/:id/bind-tenant', ({ body, params }: Ctx) => {
    const row = crud.find(SUBSCRIPTIONS, params[0]);
    if (!row) return null;
    row.tenant_id = body.tenant_id;
    row.updated_at = now();
    return row;
  }),
  route('GET', '/tenant/subscription/permission/tree', () => buildMenuTree()),

  // 租户成员：动态 baseUrl /tenant/:tenantId/member
  ...crudRoutes('/tenant/:tenantId/member', MEMBERS),
  route('PUT', '/tenant/:tenantId/member/:id/chang-status', ({ body, params }: Ctx) => {
    const row = crud.find(MEMBERS, params[1]);
    if (!row) return null;
    if (body.field !== undefined) row[body.field] = body.value;
    else Object.assign(row, body);
    row.updated_at = now();
    return row;
  }),
  route('PUT', '/tenant/:tenantId/member/:id/locked', ({ params }: Ctx) => {
    const row = crud.find(MEMBERS, params[1]);
    if (row) row.is_locked = 1;
    return row ?? null;
  }),
  route('PUT', '/tenant/:tenantId/member/:id/unLocked', ({ params }: Ctx) => {
    const row = crud.find(MEMBERS, params[1]);
    if (row) row.is_locked = 0;
    return row ?? null;
  }),
  route('PUT', '/tenant/:tenantId/member/:id/resetPassword', ({ body, params }: Ctx) => {
    const row = crud.find(MEMBERS, params[1]);
    if (row) {
      row.password = body.password ?? '123456';
      row.updated_at = now();
    }
    return row ?? null;
  }),
  route('POST', '/tenant-member', ({ body }: Ctx) => {
    const row = {
      id: nextId(),
      tenant_id: body.tenant_id,
      username: body.username,
      real_name: body.real_name ?? body.username,
      mobile_phone: body.mobile_phone ?? null,
      status: 1,
      is_locked: 0,
      created_at: now(),
      updated_at: now(),
    };
    crud.insert(MEMBERS, row);
    return row;
  }),
];

export default routes;
