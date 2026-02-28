import koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';
import koaHelmet from 'koa-helmet';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import koaStatic from 'koa-static';
import prRouter from './src/router/prRouter.js';
import puRouter from './src/router/puRouter.js';
import { initLowDB } from './src/extend/lowdb.js';
import logger from './src/extend/logger.js';

logger.info('----------------------启动中----------------------');

const app = new koa();

app.context.logger = logger;

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        logger.error(`请求错误 - ${ctx.method} ${ctx.path}`, {
            message: err.message,
            stack: err.stack
        });
        ctx.status = err.status || 500;
        ctx.body = { type: 'error', message: '系统繁忙' };
    }
});

if (process.env.USE_LOWDB === 'true') {
    app.context.lowdb = await initLowDB();
}

app.use(koaBody({
    patchNode: true,
    multipart: false,
    json: false,
    jsonStrict: true,
}));
app.use(koaHelmet());
app.use(cors());
app.use(prRouter.routes());
app.use(puRouter.routes());
app.use(puRouter.allowedMethods());
app.use(koaStatic('public'));
app.use(historyApiFallback());

app.listen(process.env.HTTP_PORT || 3000, () => {
    logger.info('http服务启动成功，访问地址:http://127.0.0.1:' + (process.env.HTTP_PORT || 3000));
});
