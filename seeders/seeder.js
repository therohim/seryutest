"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var csvParser = require("csv-parser");
var dotenv = require("dotenv");
var fs = require("fs-extra");
var path = require("path");
var pg_1 = require("pg");
dotenv.config();
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var pool, client, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pool = new pg_1.Pool({
                        user: process.env.POSTGRES_USERNAME,
                        host: process.env.POSTGRES_HOST,
                        database: process.env.POSTGRES_DB,
                        password: process.env.POSTGRES_PASSWORD,
                        port: 5432,
                    });
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, 10, 12]);
                    return [4 /*yield*/, client.query("TRUNCATE driver_attendaces, drivers, shipment_costs, shipments, variable_configs")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, seedConfig(client)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, seedDrivers(client)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, seedDriverAttendances(client)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, seedShipments(client)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, seedShipmentCosts(client)];
                case 8:
                    _a.sent();
                    console.log('All data seeded successfully');
                    return [3 /*break*/, 12];
                case 9:
                    err_1 = _a.sent();
                    console.error('Error seeding data:', err_1);
                    return [3 /*break*/, 12];
                case 10:
                    client.release();
                    return [4 /*yield*/, pool.end()];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function seedConfig(client) {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, config, _i, config_1, row, sql, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvFilePath = path.join(__dirname, 'driver_attendances.csv');
                    config = [];
                    // Read and parse the CSV file
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(csvFilePath)
                                .pipe(csvParser())
                                .on('data', function (row) {
                                config.push(row);
                            })
                                .on('end', function () {
                                console.log('config CSV file successfully processed');
                                resolve();
                            })
                                .on('error', function (error) {
                                console.error('Error reading config CSV file:', error);
                                reject(error);
                            });
                        })];
                case 1:
                    // Read and parse the CSV file
                    _a.sent();
                    _i = 0, config_1 = config;
                    _a.label = 2;
                case 2:
                    if (!(_i < config_1.length)) return [3 /*break*/, 5];
                    row = config_1[_i];
                    sql = 'INSERT INTO variable_configs (key, value) VALUES ($1, $2)';
                    values = [row.key, row.value];
                    return [4 /*yield*/, client.query(sql, values)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function seedDrivers(client) {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, drivers, _i, drivers_1, driver, sql, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvFilePath = path.join(__dirname, 'drivers.csv');
                    drivers = [];
                    // Read and parse the CSV file
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(csvFilePath)
                                .pipe(csvParser())
                                .on('data', function (row) {
                                drivers.push(row);
                            })
                                .on('end', function () {
                                console.log('Drivers CSV file successfully processed');
                                resolve();
                            })
                                .on('error', function (error) {
                                console.error('Error reading drivers CSV file:', error);
                                reject(error);
                            });
                        })];
                case 1:
                    // Read and parse the CSV file
                    _a.sent();
                    _i = 0, drivers_1 = drivers;
                    _a.label = 2;
                case 2:
                    if (!(_i < drivers_1.length)) return [3 /*break*/, 5];
                    driver = drivers_1[_i];
                    sql = 'INSERT INTO drivers (id, driver_code, name) VALUES ($1, $2, $3)';
                    values = [driver.id, driver.driver_code, driver.name];
                    return [4 /*yield*/, client.query(sql, values)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function seedDriverAttendances(client) {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, driverAttendances, _i, driverAttendances_1, row, sql, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvFilePath = path.join(__dirname, 'driver_attendances.csv');
                    driverAttendances = [];
                    // Read and parse the CSV file
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(csvFilePath)
                                .pipe(csvParser())
                                .on('data', function (row) {
                                driverAttendances.push(row);
                            })
                                .on('end', function () {
                                console.log('Driver attendances CSV file successfully processed');
                                resolve();
                            })
                                .on('error', function (error) {
                                console.error('Error reading driver attendances CSV file:', error);
                                reject(error);
                            });
                        })];
                case 1:
                    // Read and parse the CSV file
                    _a.sent();
                    _i = 0, driverAttendances_1 = driverAttendances;
                    _a.label = 2;
                case 2:
                    if (!(_i < driverAttendances_1.length)) return [3 /*break*/, 5];
                    row = driverAttendances_1[_i];
                    sql = 'INSERT INTO driver_attendances (id, driver_code, attendance_date, attendace_status) VALUES ($1, $2, $3, $4)';
                    values = [row.id, row.driver_code, row.attendance_date, row.attendance_status];
                    return [4 /*yield*/, client.query(sql, values)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function seedShipments(client) {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, shipments, _i, shipments_1, row, sql, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvFilePath = path.join(__dirname, 'shipments.csv');
                    shipments = [];
                    // Read and parse the CSV file
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(csvFilePath)
                                .pipe(csvParser())
                                .on('data', function (row) {
                                shipments.push(row);
                            })
                                .on('end', function () {
                                console.log('shipment CSV file successfully processed');
                                resolve();
                            })
                                .on('error', function (error) {
                                console.error('Error reading shipment CSV file:', error);
                                reject(error);
                            });
                        })];
                case 1:
                    // Read and parse the CSV file
                    _a.sent();
                    _i = 0, shipments_1 = shipments;
                    _a.label = 2;
                case 2:
                    if (!(_i < shipments_1.length)) return [3 /*break*/, 5];
                    row = shipments_1[_i];
                    sql = 'INSERT INTO shipments (shipment_no, shipment_date, shipment_status) VALUES ($1, $2, $3)';
                    values = [row.shipment_no, row.shipment_date, row.shipment_status];
                    return [4 /*yield*/, client.query(sql, values)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function seedShipmentCosts(client) {
    return __awaiter(this, void 0, void 0, function () {
        var csvFilePath, shipmentCosts, _i, shipmentCosts_1, row, sql, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    csvFilePath = path.join(__dirname, 'shipments.csv');
                    shipmentCosts = [];
                    // Read and parse the CSV file
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(csvFilePath)
                                .pipe(csvParser())
                                .on('data', function (row) {
                                shipmentCosts.push(row);
                            })
                                .on('end', function () {
                                console.log('shipmentCost CSV file successfully processed');
                                resolve();
                            })
                                .on('error', function (error) {
                                console.error('Error reading shipmentCost CSV file:', error);
                                reject(error);
                            });
                        })];
                case 1:
                    // Read and parse the CSV file
                    _a.sent();
                    _i = 0, shipmentCosts_1 = shipmentCosts;
                    _a.label = 2;
                case 2:
                    if (!(_i < shipmentCosts_1.length)) return [3 /*break*/, 5];
                    row = shipmentCosts_1[_i];
                    sql = 'INSERT INTO shipment_costs (id,driver_code,shipment_no,total_costs,cost_status) VALUES ($1, $2, $3, $4, $5)';
                    values = [row.id, row.driver_code, row.shipment_no, row.total_costs, row.cost_status];
                    return [4 /*yield*/, client.query(sql, values)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
seed();
