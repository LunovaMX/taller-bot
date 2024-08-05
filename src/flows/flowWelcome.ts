import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import {
    flowNewCar,
    flowWorkshopServices,
    flowContactInfo,
    flowInstagramInfo,
    flowLocationInfo,
    deactivateBot,
    flowCheckCars,
} from '../index';


const flowWelcome = addKeyword<Provider, Database>('/FLOWWELCOME')
    .addAnswer('🙌 ¡Hola! Bienvenido a nuestro Chatbot B One Automotriz.')
    .addAnswer(
        [
            '¿En qué puedo ayudarte hoy?',
            '1. Generar una cotización',
            '2. Servicios de taller',
            '3. Información de contacto',
            '4. Información de nuestro Instagram',
            '5. Ubicación de nuestro taller',
            'Por favor, escribe el número de tu elección:'
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            const choice = ctx.body.trim();
            switch (choice) {
                case '1':
                    return gotoFlow(flowCheckCars);
                case '2':
                    return gotoFlow(flowWorkshopServices);
                case '3':
                    return gotoFlow(flowContactInfo);
                case '4':
                    return gotoFlow(flowInstagramInfo);
                case '5':
                    return gotoFlow(flowLocationInfo);
                default:
                    return fallBack('Lo siento, no entendí tu elección. Por favor, escribe un número válido ( 1 - 6 ).');
            }
        }
    );

export default flowWelcome;

