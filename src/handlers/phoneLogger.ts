import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Obtener el nombre de archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../disabledBotPhones.txt');

// Promisify fs functions for better readability
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const appendFileAsync = promisify(fs.appendFile);

// Asegurar que el archivo existe
const ensureFileExists = async (): Promise<void> => {
    if (!fs.existsSync(filePath)) {
        await writeFileAsync(filePath, '');
    }
};

// Función para extraer solo los números del identificador de WhatsApp
export const extractPhoneNumber = (id: string): string => {
    const match = id.match(/\d+/);
    return match ? match[0] : '';
};

// Función para verificar si el número está en el archivo
export const isPhoneNumberInFile = async (phoneNumber: string): Promise<boolean> => {
    await ensureFileExists();

    const data = await readFileAsync(filePath, 'utf8');
    const phoneNumbers = data.split('\n').filter(Boolean); // Filtrar líneas vacías
    return phoneNumbers.includes(phoneNumber);
};

// Función para registrar un número de teléfono en el archivo
export const logPhoneNumber = async (phoneNumber: string): Promise<void> => {
    await ensureFileExists();

    const cleanPhoneNumber = extractPhoneNumber(phoneNumber);

    const data = await readFileAsync(filePath, 'utf8');
    const phoneNumbers = data.split('\n').filter(Boolean); // Filtrar líneas vacías

    if (!phoneNumbers.includes(cleanPhoneNumber)) {
        await appendFileAsync(filePath, `${cleanPhoneNumber}\n`);
        console.log(`Phone number ${cleanPhoneNumber} logged successfully.`);
    } else {
        console.log(`Phone number ${cleanPhoneNumber} is already logged.`);
    }
};

// Función para eliminar un número de teléfono del archivo
export const removePhoneNumber = async (phoneNumber: string): Promise<void> => {
    await ensureFileExists();

    const cleanPhoneNumber = extractPhoneNumber(phoneNumber);

    const data = await readFileAsync(filePath, 'utf8');
    const phoneNumbers = data.split('\n').filter(Boolean); // Filtrar líneas vacías

    if (phoneNumbers.includes(cleanPhoneNumber)) {
        const updatedPhoneNumbers = phoneNumbers.filter((number) => number !== cleanPhoneNumber);
        await writeFileAsync(filePath, updatedPhoneNumbers.join('\n') + '\n');
        console.log(`Phone number ${cleanPhoneNumber} removed successfully.`);
    } else {
        console.log(`Phone number ${cleanPhoneNumber} is not in the log.`);
    }
};
