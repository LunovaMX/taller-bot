import { addKeyword } from '@builderbot/bot';
import flowCheckCars2 from './flowCheckCars2';
import flowNewCar from './flowNewCar';

const flowCheckCars = addKeyword(['revisar coches', 'checar coches', 'ver coches'])
    .addAnswer('Vamos a revisar los coches que ya tienes registrados.', { capture: false }, async (ctx, { gotoFlow, flowDynamic, state, database }) => {
        const userId = ctx.from;
        const cars = await database.db.collection('users').find({ phone: userId }).toArray();

        if (cars.length === 0) {
            await flowDynamic('No tienes coches registrados.');
            return gotoFlow(flowNewCar)
        } else {
            let carListMessage = 'Aquí están tus coches registrados:\n';
            cars.forEach((car, index) => {
                carListMessage += `${index + 1}. Marca: ${car.brand}, Modelo: ${car.model}, Año: ${car.year}\n`;
            });
            carListMessage += '\nResponde con el número del coche que deseas seleccionar o escribe "nuevo" para registrar un coche nuevo.';
            await state.update({ carListMessage: carListMessage });
            await flowDynamic(carListMessage);
        }    
        return gotoFlow(flowCheckCars2)    
    });

export default flowCheckCars;
