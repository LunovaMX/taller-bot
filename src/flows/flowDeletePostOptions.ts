import { addKeyword } from '@builderbot/bot';
import flowWelcome from './flowWelcome'; // Suponiendo que tienes un flujo principal
import flowCheckCars from './flowCheckCars';

const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowDeletePostOptions = addKeyword('/FLOWDELETEPOSTOPTIONS')
    .addAnswer(
        '¿Qué te gustaría hacer a continuación?\n1. Ver los coches restantes\n2. Volver al menú principal',
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            const choice = normalizeInput(ctx.body);
            if (choice === '1') {
                return gotoFlow(flowCheckCars);
            } else if (choice === '2') {
                return gotoFlow(flowWelcome); // Asegúrate de tener un flujo principal definido
            } else {
                return fallBack('Por favor, responde con "1" para ver los coches restantes o "2" para volver al menú principal.');
            }
        }
    );

export default flowDeletePostOptions;
