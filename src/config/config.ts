const POSTGRES = {
    host : process.env.POSTGRES_HOST || 'test',
    db : process.env.POSTGRES_DB || 'test',
    username : process.env.POSTGRES_USERNAME || 'test',
    password : process.env.POSTGRES_PASSWORD || 'test',
    port : process.env.POSTGRES_PORT || 'test',
}

const SERVER = {
    hostname: process.env.SERVER_HOSTNAME || 'localhost',
    port: process.env.SERVER_PORT || 1010,
    cors: process.env.CORS || '*',
    disable: process.env.SERVER_DISABLE || false,
    appHost: process.env.APP_HOST,
    appProtocol: process.env.APP_PROTOCOL,
};

const config = {
    env: process.env.NODE_ENV || 'dev',
    debugMode: 'true',
    server: SERVER,
    postgres: POSTGRES
};

export default config;
