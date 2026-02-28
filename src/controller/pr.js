export default function test(ctx, next) {
    ctx.body = {
        msg: "这是一个私有路由接口",
    };
}