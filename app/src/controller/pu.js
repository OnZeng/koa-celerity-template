export default function test(ctx) {
    const { defDB } = ctx.lowdb;
    ctx.body = {
        msg: "这是一个公共路由接口",
        data: defDB.data,
        logger: b,
    };
}