import router from "koa-router";
import test from "../controller/pu.js";

// 公共路由，无需认证
const puRouter = new router();

puRouter.prefix("/api");

puRouter.get("/test", (ctx) => test(ctx));

export default puRouter;