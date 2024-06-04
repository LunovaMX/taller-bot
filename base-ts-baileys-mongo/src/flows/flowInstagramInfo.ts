import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowInstagramInfo = addKeyword<Provider, Database>(['instagram', 'redes sociales'])
    .addAnswer('Síguenos en Instagram @b1_automotriz para más actualizaciones y ofertas: https://www.instagram.com/b1_automotriz/', { capture: false })
    .addAnswer('¿Hay algo más en lo que te pueda ayudar?', { capture: true }, async (ctx, { fallBack,flowDynamic }) => {
        const response = ctx.body.trim().toLowerCase();
        
        if (response.includes('sí') || response.includes('si')) {
            // Add the flow to redirect to based on user input
        } else if (response.includes('no')) {
            await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día!');
        } else {
            return fallBack('No entendí tu respuesta, por favor dime "sí" si necesitas más información o "no" si eso es todo.');
        }
    });

export default flowInstagramInfo;