import { MemoryDB, addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database, MongoAdapter } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { join } from 'path'
import flowDescribeProblem from './flowDescribeProblem';



const normalizeInput = (input: string) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowNewCar = addKeyword<Provider, Database>(['coche', 'auto', 'vehículo'])
    .addAnswer('¡Hola! Vamos a registrar tu coche. 😊', { capture: false })
    .addAnswer('Si no sabes alguna respuesta, puedes escribir "no sé".', { capture: false })
    .addAnswer('Primero, ¿Cuál es la *marca* del coche?', { capture: true }, async (ctx, { state, fallBack,flowDynamic }) => {
        const brand = normalizeInput(ctx.body);
        if (['no sé', 'nose', 'n/a'].includes(brand)) {
            await state.update({ brand: null });
        } else {
            await state.update({ brand: ctx.body.trim() });
        }
    })
    .addAnswer('¿Y el *modelo* del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const model = normalizeInput(ctx.body);
        if (['no sé', 'nose', 'n/a'].includes(model)) {
            await state.update({ model: null });
        } else {
            await state.update({ model: ctx.body.trim() });
        }
    })
    .addAnswer('¿Cuál es el *kilometraje* del coche? (número de kilómetros recorridos)', { capture: true }, async (ctx, { state, fallBack }) => {
        const mileageInput = ctx.body.trim();
        const normalizedMileage = normalizeInput(mileageInput);

        if (['no sé', 'nose', 'n/a'].includes(normalizedMileage)) {
            await state.update({ mileage: null });
        } else {
            const mileageNumber = parseInt(mileageInput, 10);
            if (!isNaN(mileageNumber) && mileageNumber >= 0) {
                await state.update({ mileage: mileageNumber });
            } else {
                return fallBack('Por favor, ingresa un *número válido* para el kilometraje del coche.');
            }
        }
    })
    .addAnswer('¿Cuál es el *año* del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const yearString = normalizeInput(ctx.body);
        if (['no sé', 'nose', 'n/a'].includes(yearString)) {
            await state.update({ year: null });
        } else {
            const year = parseInt(ctx.body.trim(), 10);
            const currentYear = new Date().getFullYear();
            if (!isNaN(year) && year >= 1900 && year <= currentYear) {
                await state.update({ year });
            } else {
                return fallBack(`Por favor, ingresa un *año válido* (entre 1900 y ${currentYear}).`);
            }
        }
    })
    .addAnswer('Finalmente, ¿cuál es el *número de serie* del coche? (VIN)', { capture: true, media: join(process.cwd(), 'assets', 'vin.jpg') }, async (ctx, { state, fallBack, flowDynamic }) => {
        const serialNumber = normalizeInput(ctx.body);
        if (['no sé', 'nose', 'n/a'].includes(serialNumber)) {
            await state.update({ serialNumber: null })
        } else {
            const serialNumber = ctx.body.trim();
            if (ctx.body.trim().length === 17) {
                await state.update({ serialNumber });
            } else {
                return fallBack('El **VIN** debe tener 17 caracteres alfanuméricos sin espacios. Encuéntralo en la placa del VIN ubicada en el tablero del lado del conductor, debajo del parabrisas, en la etiqueta de la puerta del conductor o en los documentos del vehículo como el título o el seguro.');
            }
        }
    })
    .addAction(async (_, { state, flowDynamic }) => {
        const serialNumber = state.get('serialNumber');
        if (serialNumber == null) {
            const message = 'Entendido, es importante tener el VIN para un registro preciso del vehículo. Si encuentras esta información más tarde, sería útil actualizarla. Tener el VIN ayuda a obtener información detallada del coche como modelo, tipo de motor, marca, fecha de fabricación, entre otras, lo que facilita una cotización más fácil y detallada.'
            await flowDynamic(message);
        }
    })
    .addAnswer('Gracias por la información. Aquí está un resumen:', { capture: false }, async (ctx, { flowDynamic, state }) => {
        const brand = state.get('brand');
        const model = state.get('model');
        const mileage = state.get('mileage');
        const year = state.get('year');
        const serialNumber = state.get('serialNumber');
        
        const confirmationMessage = `Marca: ${brand !== null ? brand : 'No especificado'}\nModelo: ${model !== null ? model : 'No especificado'}\nKilometraje: ${mileage !== null ? mileage : 'No especificado'}\nAño: ${year !== null ? year : 'No especificado'}\nNúmero de Serie: ${serialNumber !== null ? serialNumber : 'No especificado'}`;
        await flowDynamic(confirmationMessage);
    })
    .addAnswer('¿Es correcta esta información? Responde con "sí" o "no".', { capture: true }, async (ctx, { flowDynamic, gotoFlow, state, fallBack, database }) => {
        const response = ctx.body.trim().toLowerCase();

        if (['sí', 'si'].includes(response)) {
            await flowDynamic('¡Perfecto! La información ha sido guardada correctamente. Gracias. 😊');
            

             // Guardar la información en la base de datos
        const userData = {
            phone: ctx.from, // Número de teléfono del usuario
            brand: state.get('brand'),
            model: state.get('model'),
            mileage: state.get('mileage'),
            year: state.get('year'),
            serialNumber: state.get('serialNumber'),
        };

        await database.db.collection('users').insertOne(userData);
            // TODO: Enviar al flujo de que quiere hacer

            return gotoFlow(flowDescribeProblem);

        } else if (['no', 'nó'].includes(response)) {
            await flowDynamic('Entiendo, vamos a ingresar la información nuevamente.');
            return gotoFlow(flowNewCar);
        } else {
            return fallBack('Por favor, responde con "sí" si la información es correcta o "no" si deseas corregirla.');
        }
    });

export default flowNewCar;
