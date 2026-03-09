import { JSONFilePreset } from 'lowdb/node';
import { randomUUID } from 'crypto';
import { access, constants, mkdir } from 'fs/promises';
import logger from './logger.js';

export async function initLowDB() {
    const defaultUser = {
        uuid: randomUUID(),
        name: 'test',
        password: '123456',
    };
    logger.info('正在初始化lowdb数据库');
    try {
        await access('./data', constants.F_OK);
    } catch {
        await mkdir('./data');
        logger.info('正在创建lowdb默认数据文件');
    }
    const defDB = await JSONFilePreset('./data/def.json', [defaultUser]);
    await defDB.read();
    await defDB.write();
    logger.info('lowdb数据加载完成');
    return {
        defDB,
    };
}
