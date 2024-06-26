import { MemoryDB, addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database, MongoAdapter } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import flowNewCar from './flowNewCar';
import { ObjectId } from 'mongodb';

const normalizeInput = (input: string) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowCheckCars = addKeyword<Provider, Database>(['revisar coches', 'checar coches', 'ver coches'])
    .addAnswer('Vamos a revisar los coches que ya tienes registrados.', { capture: false }, async (ctx, { flowDynamic, state, database }) => {
        const userId = ctx.from;
        const cars = await database.db.collection('users').find({ phone: userId }).toArray();

        if (cars.length === 0) {
            await flowDynamic('No tienes coches registrados.');
            await flowDynamic('¿Te gustaría registrar un coche ahora? Responde con "sí" o "no".');
        } else {
            let carListMessage = 'Aquí están tus coches registrados:\n';
            cars.forEach((car, index) => {
                carListMessage += `${index + 1}. Marca: ${car.brand}, Modelo: ${car.model}, Año: ${car.year}\n`;
            });
            carListMessage += '\nResponde con el número del coche que deseas seleccionar o escribe "nuevo" para registrar un coche nuevo.';
            await state.update({ carListMessage: carListMessage });
            await flowDynamic(carListMessage);
        }        
    })

    .addAnswer('Selecciona una opción', { capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow, database }) => {
        const userId = ctx.from;
        const input = normalizeInput(ctx.body);
        const cars = await database.db.collection('users').find({ phone: userId }).toArray();

        if (input === 'nuevo') {
            return gotoFlow(flowNewCar);
        } else {
            const carIndex = parseInt(input, 10) - 1;

            if (isNaN(carIndex) || carIndex < 0 || carIndex >= cars.length) {
                return fallBack('Por favor, ingresa un número válido o "nuevo" para registrar un coche nuevo.');
            } else {
                const selectedCar = cars[carIndex];
                const confirmationMessage = `Has seleccionado:\nMarca: ${selectedCar.brand}\nModelo: ${selectedCar.model}\nAño: ${selectedCar.year}\nKilometraje: ${selectedCar.mileage}\nNúmero de Serie: ${selectedCar.serialNumber}`;
                await state.update({ selectedCarId: selectedCar._id });
                await flowDynamic(confirmationMessage);                
            }
        }
    })
    .addAnswer('¿Deseas editar la información de este coche? Responde con "sí" o "no".', { capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow, database }) => {
        const response = normalizeInput(ctx.body);

        if (['sí', 'si'].includes(response)) {
            const selectedCarId = state.get('selectedCarId');
            const selectedCar = await database.db.collection('users').findOne({ _id: new ObjectId(selectedCarId) });
            
            await state.update({
                brand: selectedCar.brand,
                model: selectedCar.model,
                mileage: selectedCar.mileage,
                year: selectedCar.year,
                serialNumber: selectedCar.serialNumber,
            });

            return gotoFlow(flowNewCar);
        } else if (['no', 'nó'].includes(response)) {
            await flowDynamic('Perfecto. ¿Hay algo más en lo que te pueda ayudar?');
        } else {
            return fallBack('Por favor, responde con "sí" si deseas editar la información o "no" si no deseas realizar cambios.');
        }
    });

export default flowCheckCars;
