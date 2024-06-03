import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { join } from 'path'


const normalizeInput = (input: string) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};


const flowNewCar = addKeyword<Provider, Database>(['car'])
    .addAnswer('¿Cuál es la marca del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const brand = normalizeInput(ctx.body);
        if (brand === 'no se' || brand === 'nose' || brand === 'n/a') {
            await state.update({ brand: null });
        } else {
            await state.update({ brand: ctx.body.trim() });
        }
    })
    .addAnswer('¿Cuál es el modelo del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const model = normalizeInput(ctx.body);
        if (model === 'no se' || model === 'nose' || model === 'n/a') {
            await state.update({ model: null });
        } else {
            await state.update({ model: ctx.body.trim() });
        }
    })
    .addAnswer('¿Cuál es el kilometraje del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const mileageInput = ctx.body.trim();
        const normalizedMileage = normalizeInput(mileageInput);

        if (normalizedMileage === 'no se' || normalizedMileage === 'nose' || normalizedMileage === 'n/a') {
            await state.update({ mileage: null });
        } else {
            const mileageNumber = parseInt(mileageInput, 10);
            if (!isNaN(mileageNumber) && mileageNumber >= 0) {
                await state.update({ mileage: mileageNumber });
            } else {
                return fallBack('Por favor, ingresa un número válido para el kilometraje del coche.');
            }
        }
    })
    .addAnswer('¿Cuál es el año del coche?', { capture: true }, async (ctx, { state, fallBack }) => {
        const yearString = normalizeInput(ctx.body);
        if (yearString === 'no se' || yearString === 'nose' || yearString === 'n/a') {
            await state.update({ year: null });
        } else {
            const year = parseInt(ctx.body.trim(), 10);
            const currentYear = new Date().getFullYear();
            if (!isNaN(year) && year >= 1900 && year <= currentYear) {
                await state.update({ year });
            } else {
                return fallBack(`Por favor, ingresa un año válido (entre 1900 y ${currentYear}).`);
            }
        }
        
    })
    .addAnswer('¿Cuál es el número de serie del coche? (Puede encontrarlo en el parabrisas o en la tarjeta de circulación)', { capture: true }, async (ctx, { state, fallBack, flowDynamic }) => {
        const serialNumber = normalizeInput(ctx.body);
        if (serialNumber === 'no se' || serialNumber === 'nose' || serialNumber === 'n/a') {
            await state.update({ serialNumber: null })
            const message = 'Entendido, es importante tener el VIN para un registro preciso del vehículo. Si encuentras esta información más tarde, sería útil actualizarla.'
            await flowDynamic(message)

        } else {
            if (ctx.body.trim().length === 17) {
                await state.update({ serialNumber: ctx.body.trim() });
            } else {
                return fallBack('El VIN debe tener 17 caracteres alfanuméricos sin espacios. Encuéntralo en la placa del VIN ubicada en el tablero del lado del conductor, debajo del parabrisas, en la etiqueta de la puerta del conductor o en los documentos del vehículo como el título o el seguro.');
            }
        }

        console.log('HOLA');
    })
    .addAnswer('Por favor confirma la información que ingresaste:', { capture: false }, async (ctx, { flowDynamic, state, gotoFlow }) => {
        const brand = state.get('brand');
        const model = state.get('model');
        const mileage = state.get('mileage');
        const year = state.get('year');
        const serialNumber = state.get('serialNumber');

        console.log('Final Values:');
        console.log('Brand:', brand);
        console.log('Model:', model);
        console.log('Mileage:', mileage);
        console.log('Year:', year);
        console.log('Serial Number:', serialNumber);
        
        const confirmationMessage = `Marca: ${brand !== null ? brand : 'No especificado'}\nModelo: ${model !== null ? model : 'No especificado'}\nKilometraje: ${mileage !== null ? mileage : 'No especificado'}\nAño: ${year !== null ? year : 'No especificado'}\nNúmero de Serie: ${serialNumber !== null ? serialNumber : 'No especificado'}`;
        await flowDynamic(confirmationMessage);

    })
    .addAnswer('Responde con "sí" si es correcta o "no" si deseas corregirla.', { capture: true }, async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
        const response = ctx.body.trim().toLowerCase();

        if (['sí', 'si'].includes(response)) {
            await flowDynamic('La información ha sido guardada correctamente. Gracias.');
            
            // TODO: Enviar al flujo de que quiere hacer

        } else if (['no', 'nó'].includes(response)) {
            await flowDynamic('Vamos a ingresar la información nuevamente.');
            return gotoFlow(flowNewCar);
        } else {
            return fallBack('Por favor, responde con "sí" si la información es correcta o "no" si deseas corregirla.');
        }
    });

export default flowNewCar;
