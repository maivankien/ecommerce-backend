export enum RedisSetOptions {
    EXPIRE_IN_SECONDS = 'EX', // TTL theo giây
    EXPIRE_IN_MILLISECONDS = 'PX', // TTL theo millisecond
    ONLY_IF_NOT_EXISTS = 'NX', // Chỉ set nếu key chưa tồn tại
    ONLY_IF_EXISTS = 'XX', // Chỉ set nếu key đã tồn tại
}
