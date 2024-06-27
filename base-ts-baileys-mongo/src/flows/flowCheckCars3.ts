import { addKeyword } from '@builderbot/bot';
import flowNewCar from './flowNewCar';
import { ObjectId } from 'mongodb';
import flowDescribeProblem from './flowDescribeProblem';
import flowEditCar from './flowEditCar';


const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowCheckCars3 = addKeyword(['revisar coches', 'checar coches', 'ver coches'])
    .addAnswer('¿Deseas editar la información de este coche? Responde con "sí" o "no".', { capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow, database }) => {
        const response = normalizeInput(ctx.body);

        if (['sí', 'si'].includes(response)) {
            return gotoFlow(flowEditCar);
        } else if (['no', 'nó'].includes(response)) {
            return gotoFlow(flowDescribeProblem)
        } else {
            return fallBack('Por favor, responde con "sí" si deseas editar la información o "no" si no deseas realizar cambios.');
        }
    });

export default flowCheckCars3;
