import type { RouteDef } from './types';

import { crudRoutes } from './system';
import { nextId, now } from '../utils/admin/store';

/** template 模块内存数据集（前端 BaseService 全量 CRUD） */
function seed(prefix: string): Record<string, any>[] {
  return [
    {
      id: nextId(),
      name: `${prefix} 示例`,
      code: `${prefix}_demo`,
      status: 1,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

const CONFIG = seed('config');
const DICT = seed('dict');
const DICT_ITEM = seed('dict_item');
const MENU = seed('menu');
const WEB_MENU = seed('web_menu');

const opts = {
  searchFields: ['name', 'code'],
  filterFields: ['status'],
  newRow: (data: Record<string, any>) => ({
    id: nextId(),
    name: data.name ?? '',
    code: data.code ?? '',
    status: data.status ?? 1,
    created_at: now(),
    updated_at: now(),
  }),
};

const routes: RouteDef[] = [
  ...crudRoutes('/template/config', CONFIG, opts),
  ...crudRoutes('/template/dict', DICT, opts),
  ...crudRoutes('/template/dict-item', DICT_ITEM, opts),
  ...crudRoutes('/template/menu', MENU, opts),
  ...crudRoutes('/template/web-menu', WEB_MENU, opts),
];

export default routes;
