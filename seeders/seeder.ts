// import * as csvParser from 'csv-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Pool, PoolClient } from 'pg';
const csvParser = require('csv-parser')

dotenv.config();

interface Config {
  key: string;
  value: number;
}

interface Driver {
  id: number;
  driver_code: string;
  name: string;
}

interface DriverAttendance {
  id: number;
  driver_code: string;
  attendance_date: Date;
  attendance_status: Boolean;
}

interface Shipment {
  shipment_no: string;
  shipment_date: string;
  shipment_status: string;
}

interface ShipmentCost {
  id: number
  driver_code: string;
  shipment_no: string;
  total_costs: number;
  cost_status: string;
}

async function seed() {
    const pool = new Pool({
      user: process.env.POSTGRES_USERNAME,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    });

    const client = await pool.connect();

    try {
        await client.query("TRUNCATE driver_attendances, drivers, shipment_costs, shipments, variable_configs");
        await seedConfig(client);
        await seedDrivers(client);
        await seedDriverAttendances(client);
        await seedShipments(client);
        await seedShipmentCosts(client);
        console.log('All data seeded successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

async function seedConfig(client: PoolClient) {
    const csvFilePath = path.join(__dirname, 'variable_configs.csv');
    const config: Config[] = [];

    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row: Config) => {
                config.push(row);
            })
            .on('end', () => {
                console.log('config CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error reading config CSV file:', error);
                reject(error);
            });
    });

    for (const row of config) {
        const sql = 'INSERT INTO variable_configs (key, value) VALUES ($1, $2)';
        const values = [row.key, row.value];
        await client.query(sql, values);
    }
}

async function seedDrivers(client: PoolClient) {
    const csvFilePath = path.join(__dirname, 'drivers.csv');
    const drivers: Driver[] = [];

    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row: Driver) => {
                drivers.push(row);
            })
            .on('end', () => {
                console.log('Drivers CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error reading drivers CSV file:', error);
                reject(error);
            });
    });

    for (const driver of drivers) {
        const sql = 'INSERT INTO drivers (id, driver_code, name) VALUES ($1, $2, $3)';
        const values = [driver.id, driver.driver_code, driver.name];
        await client.query(sql, values);
    }
}

async function seedDriverAttendances(client: PoolClient) {
    const csvFilePath = path.join(__dirname, 'driver_attendances.csv');
    const driverAttendances: DriverAttendance[] = [];

    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row: DriverAttendance) => {
                driverAttendances.push(row);
            })
            .on('end', () => {
                console.log('Driver attendances CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error reading driver attendances CSV file:', error);
                reject(error);
            });
    });

    for (const row of driverAttendances) {
        const sql = 'INSERT INTO driver_attendances (id, driver_code, attendance_date, attendance_status) VALUES ($1, $2, $3, $4)';
        const values = [row.id, row.driver_code, row.attendance_date, row.attendance_status];
        await client.query(sql, values);
    }
}

async function seedShipments(client: PoolClient) {
    const csvFilePath = path.join(__dirname, 'shipments.csv');
    const shipments: Shipment[] = [];

    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row: Shipment) => {
                shipments.push(row);
            })
            .on('end', () => {
                console.log('shipment CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error reading shipment CSV file:', error);
                reject(error);
            });
    });

    for (const row of shipments) {
        const sql = 'INSERT INTO shipments (shipment_no, shipment_date, shipment_status) VALUES ($1, $2, $3)';
        const values = [row.shipment_no, row.shipment_date, row.shipment_status];
        await client.query(sql, values);
    }
}

async function seedShipmentCosts(client: PoolClient) {
    const csvFilePath = path.join(__dirname, 'shipment_costs.csv');
    const shipmentCosts: ShipmentCost[] = [];

    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row: ShipmentCost) => {
                shipmentCosts.push(row);
            })
            .on('end', () => {
                console.log('shipmentCost CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error reading shipmentCost CSV file:', error);
                reject(error);
            });
    });

    for (const row of shipmentCosts) {
        const sql = 'INSERT INTO shipment_costs (id,driver_code,shipment_no,total_costs,cost_status) VALUES ($1, $2, $3, $4, $5)';
        const values = [row.id, row.driver_code, row.shipment_no, row.total_costs, row.cost_status];
        await client.query(sql, values);
    }
}

seed();