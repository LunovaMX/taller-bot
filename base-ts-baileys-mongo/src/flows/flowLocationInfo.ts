import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowLocationInfo = addKeyword<Provider, Database>(['ubicacion', 'direccion'])
    .addAnswer('🏠 Nuestra ubicación es Oscar Wilde 248, San Jeronimo, 64630 Monterrey, N.L.')
    .addAnswer('Aquí tienes el enlace de Google Maps para que nos encuentres fácilmente: https://maps.app.goo.gl/K2XobXHCy8wNJGhF9')
    .addAnswer('¿Hay algo más en lo que te pueda ayudar? 😊', { capture: true }, async (ctx, { fallBack,flowDynamic }) => {
        const response = ctx.body.trim().toLowerCase();
        
        if (response.includes('sí') || response.includes('si')) {
            // Redirigir al flujo correspondiente según la respuesta del usuario
            await flowDynamic('¡Perfecto! ¿En qué más puedo ayudarte hoy?');
        } else if (response.includes('no')) {
            await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día! 😊');
        } else {
            return fallBack('No entendí tu respuesta, por favor dime "sí" si necesitas más información o "no" si eso es todo.');
        }
    });

export default flowLocationInfo;
