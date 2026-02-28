import router from "koa-router";
import { checkToken } from "../middleware/jwt.js";
import pr from "../controller/pr.js";

// 私有路由，需要认证
const prRouter = new router();

prRouter.prefix("/api");

prRouter.use(checkToken);

// 查询用户信息
prRouter.get("/user", (ctx) => pr(ctx));

export default prRouter;