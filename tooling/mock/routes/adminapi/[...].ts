import { createDispatchHandler } from '~/utils/dispatch';

/** 兼容历史 /adminapi 调用（不做 platform 路径别名） */
export default createDispatchHandler('/adminapi');
