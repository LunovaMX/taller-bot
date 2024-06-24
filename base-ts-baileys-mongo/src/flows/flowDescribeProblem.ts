import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const workingHoursStart = 10; // Hora de inicio del servicio (9 AM)
const workingHoursEnd = 18; // Hora de fin del servicio (6 PM)

const isWithinWorkingHours = () => {
    const currentHour = new Date().getHours();
    return currentHour >= workingHoursStart && currentHour < workingHoursEnd;
};

const flowDescribeProblem = addKeyword<Provider, Database>(['problema', 'reparación', 'servicio'])
    .addAnswer('Ahora, por favor cuéntanos, ¿cuál es el problema principal con tu coche o qué servicio necesitas? 🚗', { capture: true }, async (ctx, { state }) => {
        await state.update({ problemDescription: ctx.body.trim() });
    })
    .addAnswer('Entendido. Estamos verificando la disponibilidad de nuestros agentes...', { capture: false })
    .addAction(async (_, { state, flowDynamic }) => {
        const brand = state.get('brand');
        const model = state.get('model');
        const mileage = state.get('mileage');
        const year = state.get('year');
        const serialNumber = state.get('serialNumber');
        const problemDescription = state.get('problemDescription');

        const summaryMessage = `Aquí está un resumen de la información de tu coche y el problema que has descrito:\n\nMarca: ${brand !== null ? brand : 'No especificado'}\nModelo: ${model !== null ? model : 'No especificado'}\nKilometraje: ${mileage !== null ? mileage : 'No especificado'}\nAño: ${year !== null ? year : 'No especificado'}\nNúmero de Serie: ${serialNumber !== null ? serialNumber : 'No especificado'}\n\nDescripción del problema: ${problemDescription !== null ? problemDescription : 'No especificado'}`;
        await flowDynamic(summaryMessage);
    })
    .addAnswer('¿Es correcta esta información? Responde con "sí" o "no".', { capture: true }, async (ctx, { flowDynamic, gotoFlow, state, fallBack, endFlow }) => {
        const response = ctx.body.trim().toLowerCase();

        if (['sí', 'si'].includes(response)) {
            if (isWithinWorkingHours()) {
                await flowDynamic('¡Perfecto! Un agente se pondrá en contacto contigo muy pronto para seguir con el proceso de cotización. Gracias por tu paciencia. 😊');
                await state.update({botActive:false})
                return endFlow();
            } else {
                await flowDynamic('Gracias por tu paciencia. Actualmente estamos fuera de nuestro horario de servicio. Un agente se pondrá en contacto contigo mañana para continuar con tu cotización. Que tengas un buen día. 😊');
            }

        } else if (['no', 'nó'].includes(response)) {
            await flowDynamic('Entiendo, vamos a ingresar la información nuevamente.');
            return gotoFlow(flowDescribeProblem);
        } else {
            return fallBack('Por favor, responde con "sí" si la información es correcta o "no" si deseas corregirla.');
        }
    });

export default flowDescribeProblem;
