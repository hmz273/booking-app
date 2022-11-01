export const encode = (token) => Buffer.from(token).toString('base64');
export const decode = (token) => Buffer.from(token, 'base64').toString('ascii');
