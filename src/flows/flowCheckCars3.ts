import { addKeyword } from '@builderbot/bot';
import flowNewCar from './flowNewCar';
import { ObjectId } from 'mongodb';
import flowDescribeProblem from './flowDescribeProblem';
import flowEditCar from './flowEditCar';
import flowDeleteCar from './flowDeleteCar';


const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowCheckCars3 = addKeyword('/FLOWCHECKCARS3')
    .addAnswer(
        'Por favor, selecciona una de las siguientes opciones:\n1. Continuar con este coche para la cotización\n2. Editar la información del coche\n3. Eliminar este coche\n\nResponde con el número de tu elección.',
        { capture: true },
        async (ctx, { flowDynamic, state, fallBack, gotoFlow, database }) => {
            const response = normalizeInput(ctx.body);

            switch (response) {
                case '1':
                    return gotoFlow(flowDescribeProblem);
                case '2':
                    return gotoFlow(flowEditCar);
                case '3':
                    return gotoFlow(flowDeleteCar);
                default:
                    return fallBack('Por favor, responde con el número de tu elección: 1 para continuar, 2 para editar o 3 para eliminar el coche.');
            }
        }
    );


export default flowCheckCars3;
