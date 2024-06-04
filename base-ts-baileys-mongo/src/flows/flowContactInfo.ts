import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowContactInfo = addKeyword<Provider, Database>(['contacto', 'informacion de contacto'])
    .addAnswer('Para contactarnos puedes llamarnos al número 81 1481 8453 o enviarnos un WhatsApp al 81 2921 3794.', { capture: false })
    .addAnswer('También puedes enviarnos un correo electrónico a bone.automotriz@gmail.com.', { capture: false })
    .addAnswer('¿Hay algo más en lo que te pueda ayudar?', { capture: true }, async (ctx, { fallBack, flowDynamic }) => {
        const response = ctx.body.trim().toLowerCase();
        
        if (response.includes('sí') || response.includes('si')) {
            // Add the flow to redirect to based on user input
        } else if (response.includes('no')) {
            await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día!');
        } else {
            return fallBack('No entendí tu respuesta, por favor dime "sí" si necesitas más información o "no" si eso es todo.');
        }
    });

export default flowContactInfo;
