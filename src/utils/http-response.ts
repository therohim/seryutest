import { Response } from 'express';
import path from 'path';
import logger from '../service/logger';

const serverLocaleId = 'id';

const defaultErrorMessage: any = {
    200: { id: 'Success' },
    500: { id: 'Wrong system' },
    400: { id: 'Wrong request' },
    403: { id: 'Unauthenticated' },
    404: { id: 'Unauthenticated' },
    405: { id: 'forbidden access' },
    default: { id: 'Wrong system' }
};

const getStackInfo = (stackIndex: number, stack: string) => {
    var PROJECT_ROOT = path.join(__dirname, '..');
    var stacklist = stack.split('\n').slice(3);
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    var s = stacklist[stackIndex] || stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
        return {
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: `${sp[3]}:${sp[4]}`,
            stack: stacklist.join('\n')
        };
    }
};

const createResponse = (res: Response, respCode: number, params = <any>{}, errorDetail = <any>{}) => {
    if (respCode === 200) {
        let message;
        if (params.message) {
            message = params.message[serverLocaleId] ? params.message[serverLocaleId] : defaultErrorMessage[200][serverLocaleId];
        }
        return res.status(200).json({
            status: 'success',
            code: params.code || 200,
            response: params.response,
            message: message
        });
    } else {
        let severity;
        if (respCode == 404 || respCode == 400) {
            severity = 'warning';
        } else if (respCode == 409) {
            severity = 'error';
        } else {
            severity = params.severity ? params.severity : respCode === 500 ? 'wtf' : 'high';
        }
        let statusCode: number = respCode ? respCode : 500;
        let errCode = params.code ? params.code : statusCode + '';
        let message;
        let errorMessage;
        if (params.message) {
            message = params.message[serverLocaleId]
                ? params.message[serverLocaleId]
                : defaultErrorMessage[statusCode]
                ? defaultErrorMessage[statusCode][serverLocaleId]
                : defaultErrorMessage.default.id;
        } else {
            message = defaultErrorMessage[statusCode] ? defaultErrorMessage[statusCode][serverLocaleId] : defaultErrorMessage.default.id;
        }
        if (params.error) {
            let stack = params.error.stack;
            let errorStack = message;

            if (stack) {
                let stackInfo = getStackInfo(1, stack);
                errorStack = errorStack + ` (path: ${stackInfo?.relativePath || '-'}, line: ${stackInfo?.line || '-'})`;
            }
            errorStack = errorStack + ` (${JSON.stringify(params.error)})`;

            logger.error(`${statusCode} ${errorStack || ''}`);
        } else {
            logger.error(`${statusCode} ${message || ''}`);
        }

        return res.status(statusCode).json({
            status: 'failure',
            severity: severity,
            code: params.code ? params.code : errCode,
            redirect: params.redirect,
            errorDetail,
            message: message,
            errorMessage: errorMessage,
            response: params.response
        });
    }
};

export default createResponse;
