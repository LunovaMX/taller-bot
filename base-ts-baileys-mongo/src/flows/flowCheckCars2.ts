import { addKeyword } from '@builderbot/bot';
import flowCheckCars3 from './flowCheckCars3';
import flowNewCar from './flowNewCar';

const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowCheckCars2 = addKeyword(['revisar coches', 'checar coches', 'ver coches'])
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
                await state.update({
                    selectedCarId: selectedCar._id,
                    brand: selectedCar.brand,
                    model: selectedCar.model,
                    mileage: selectedCar.mileage,
                    year: selectedCar.year,
                    serialNumber: selectedCar.serialNumber,
                });
                await flowDynamic(confirmationMessage);                
            }
        }
        return gotoFlow(flowCheckCars3)
    });

export default flowCheckCars2;
