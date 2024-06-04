import { addKeyword, EVENTS } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


// const checkUserStatus = async (phoneNumber: string, database: Database): Promise<string> => {
//     Query MongoDB to find the user by phoneNumber
//     const user = await Database.collection('users').findOne({ phoneNumber });
//     if (!user) {
//         return 'new';
//     } else if (user.registered) {
//         return 'registered';
//     } else {
//         return 'info_only';
//     }
    
// };


const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer('¡Hola! Bienvenido a nuestro servicio de cotización de autos 🚗. ¿Cómo puedo ayudarte hoy?')
    .addAnswer(
        'Por favor, responde con *Nuevo* si es tu primera vez, *Cotización* si deseas una cotización o *Ayuda* si necesitas otro tipo de información.',
        { capture: true },
        async (ctx, { gotoFlow, database }) => {
            // const phoneNumber = ctx.from; // Adjust this according to how your provider handles sender info
            // const userStatus = await checkUserStatus(phoneNumber, database);+
            // const userStutus 0 'new'

            // switch (userStatus) {
            //     case 'new':
            //         //return gotoFlow(registerNewCustomerFlow);
            //     case 'registered':
            //         //return gotoFlow(fetchCustomerDataFlow);
            //     case 'info_only':
            //         return 'Parece que ya nos has contactado antes pero aún no completaste tu registro. ¿Quieres hacerlo ahora?';
            //     default:
            //         return 'No entendí tu respuesta. Intenta de nuevo.';
            // }
        }
    );

export default welcomeFlow;