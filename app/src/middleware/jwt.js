import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";


/**
 * 加密属性
 */
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // 32字节的随机密钥
const iv = crypto.randomBytes(16); // 16字节的随机初始向量


// 校验token
export function checkToken(ctx, next) {
    const token = ctx.header.authorization
    // console.log(token);
    // 校验token格式
    const tokenRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (!tokenRegex.test(token)) return ctx.body = {
        type: "error",
        message: "身份认证失败",
    }

    try {
        const user = verifyToken(token);
        ctx.user = user;
        next();
    } catch (error) {
        console.log('token解密失败:' + error.message);
        return ctx.body = {
            type: "error",
            message: "身份认证失败",
        };
    }
}
// 创建token
export function createToken(data) {
    const token = jsonwebtoken.sign(data, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    // 生产环境加密token
    if (process.env.TOKEN_ENABLED === 'true') {
        console.log(process.env.TOKEN_ENABLED)
        return encrypt(token)
    } else {
        return token;
    }
}

// 验证token
export function verifyToken(token) {
    // 生产环境解密token
    if (process.env.TOKEN_ENABLED === 'true') {
        console.log(Boolean(process.env.TOKEN_ENABLED))
        return jsonwebtoken.verify(decrypt(token), process.env.TOKEN_SECRET);
    } else {
        return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }
}

// 加密函数
export function encrypt(str) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(str, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

// 解密函数
export function decrypt(str) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(str, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}