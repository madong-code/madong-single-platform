import { createDispatchHandler } from '~/utils/dispatch';

/** platform 前端统一前缀 /platformapi，套用前端 auth 路径别名 */
export default createDispatchHandler('/platformapi', true);
