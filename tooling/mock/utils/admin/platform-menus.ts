/**
 * 平台运营端菜单（由 backend/resource/data/menu/platform.php 种子数据转换生成）
 * 结构与真实后端 AuthService::buildPlatformMenuTree 输出一致（RouteRecordStringComponent[]）。
 * 当后端菜单种子变更时，请重新生成此文件以保持 mock 与真实菜单同步。
 *
 * @generated
 */
export const PLATFORM_MENUS = [
  {
    "name": "platform:home",
    "path": "/home",
    "meta": {
      "title": "首页",
      "icon": "ant-design:home-outlined",
      "order": -1
    },
    "redirect": "/workspace",
    "children": [
      {
        "name": "platform:dashboard:analytics:list",
        "path": "/analytics",
        "meta": {
          "title": "分析页",
          "icon": "ant-design:fund-filled",
          "order": 1
        },
        "component": "/dashboard/analytics/index"
      },
      {
        "name": "platform:dashboard:workspace:list",
        "path": "/workspace",
        "meta": {
          "title": "工作台",
          "icon": "ant-design:appstore-outlined",
          "order": 2
        },
        "component": "/dashboard/workspace/index"
      }
    ]
  },
  {
    "name": "platform:tenant",
    "path": "/tenant",
    "meta": {
      "title": "租户管理",
      "icon": "ant-design:team-outlined",
      "order": 10
    },
    "redirect": "/tenant/account",
    "children": [
      {
        "name": "platform:tenant:account:list",
        "path": "/tenant/account",
        "meta": {
          "title": "租户列表",
          "icon": "ant-design:unordered-list-outlined",
          "order": 1
        },
        "component": "/tenant/account/index"
      },
      {
        "name": "platform:tenant:subscription:list",
        "path": "/tenant/subscription",
        "meta": {
          "title": "套餐管理",
          "icon": "ant-design:gift-outlined",
          "order": 2
        },
        "component": "/tenant/subscription/index"
      }
    ]
  },
  {
    "name": "platform:setting",
    "path": "/database",
    "meta": {
      "title": "基础设置",
      "icon": "ant-design:database-outlined",
      "order": 20
    },
    "redirect": "/system/config",
    "children": [
      {
        "name": "platform:system:config:list",
        "path": "/system/config",
        "meta": {
          "title": "系统配置",
          "icon": "ant-design:setting-outlined",
          "order": 1
        },
        "component": "/system/config/index"
      },
      {
        "name": "platform:database:setting:list",
        "path": "/database",
        "meta": {
          "title": "数据中心",
          "icon": "ant-design:cloud-server-outlined",
          "order": 2
        },
        "component": "/database/index"
      },
      {
        "name": "platform:menu:platform:list",
        "path": "/system/menu",
        "meta": {
          "title": "平台菜单",
          "icon": "ant-design:appstore-outlined",
          "order": 3
        },
        "component": "/system/menu/index"
      }
    ]
  },
  {
    "name": "platform:template",
    "path": "/template",
    "meta": {
      "title": "模板管理",
      "icon": "ant-design:copy-outlined",
      "order": 25
    },
    "redirect": "/template/config",
    "children": [
      {
        "name": "platform:system:config-template:list",
        "path": "/template/config",
        "meta": {
          "title": "配置模版",
          "icon": "ant-design:control-outlined",
          "order": 1
        },
        "component": "/template/config/index"
      },
      {
        "name": "platform:menu:template:list",
        "path": "/template/menu",
        "meta": {
          "title": "后台菜单",
          "icon": "ant-design:menu-outlined",
          "order": 2
        },
        "component": "/template/menu/index"
      },
      {
        "name": "platform:dict:template:list",
        "path": "/template/dict",
        "meta": {
          "title": "字典管理",
          "icon": "ant-design:database-outlined",
          "order": 3
        },
        "component": "/template/dict/index"
      },
      {
        "name": "platform:template:web-menu:list",
        "path": "/template/web-menu",
        "meta": {
          "title": "前台菜单",
          "icon": "ant-design:global-outlined",
          "order": 5
        },
        "component": "/template/web-menu/index"
      }
    ]
  },
  {
    "name": "app",
    "path": "/app",
    "meta": {
      "title": "应用管理",
      "icon": "ant-design:menu-outlined",
      "order": 40
    },
    "redirect": "/app/plugin/market",
    "children": [
      {
        "name": "platform:plugin:my-apps:list",
        "path": "/app/installed",
        "meta": {
          "title": "我的应用",
          "icon": "ant-design:appstore-outlined",
          "order": 0
        },
        "component": "/app/installed/index"
      },
      {
        "name": "platform:plugin:market:list",
        "path": "/app/plugin/market",
        "meta": {
          "title": "模块市场",
          "icon": "ant-design:shopping-cart-outlined",
          "order": 1
        },
        "component": "/app/plugin/market/index"
      },
      {
        "name": "platform:plugin:develop:list",
        "path": "/app/plugin/develop",
        "meta": {
          "title": "插件开发",
          "icon": "ant-design:code-outlined",
          "order": 2
        },
        "component": "/app/plugin/develop/index"
      },
      {
        "name": "platform:generator:code:list",
        "path": "/app/generator",
        "meta": {
          "title": "代码生成",
          "icon": "ant-design:thunderbolt-outlined",
          "order": 3
        },
        "component": "/app/generator/index"
      },
      {
        "name": "platform:madong:delegation:read",
        "path": "/app/plugin/delegation",
        "meta": {
          "title": "授权信息",
          "icon": "ant-design:safety-certificate-outlined",
          "order": 4
        },
        "component": "/app/plugin/delegation/index"
      }
    ]
  },
  {
    "name": "platform:ops",
    "path": "/ops",
    "meta": {
      "title": "运维管理",
      "icon": "ant-design:tool-outlined",
      "order": 28
    },
    "redirect": "/ops/crontab",
    "children": [
      {
        "name": "crontab:task:list",
        "path": "/ops/crontab",
        "meta": {
          "title": "定时任务",
          "icon": "arcticons:jobstreet",
          "order": 1
        },
        "component": "/ops/crontab/index"
      },
      {
        "name": "platform:monitor:login-log:list",
        "path": "/ops/log/login",
        "meta": {
          "title": "登录日志",
          "icon": "ant-design:login-outlined",
          "order": 2
        },
        "component": "/ops/log/login/index"
      },
      {
        "name": "platform:monitor:operation-log:list",
        "path": "/ops/log/operate",
        "meta": {
          "title": "操作日志",
          "icon": "ant-design:swap-outlined",
          "order": 3
        },
        "component": "/ops/log/operate/index"
      }
    ]
  }
] as const;
