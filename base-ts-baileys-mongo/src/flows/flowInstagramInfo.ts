import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowInstagramInfo = addKeyword<Provider, Database>('/FLOWINSTAGRAMINFO')
    .addAnswer('📸 ¡Nos encantaría que nos siguieras en Instagram! Encuéntranos como @b1_automotriz para estar al tanto de nuestras últimas actualizaciones y ofertas exclusivas.')
    .addAnswer('Aquí tienes el enlace directo: https://www.instagram.com/b1_automotriz/')
    .addAnswer(
        '¿Hay algo más en lo que te pueda ayudar? 😊',
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            const response = ctx.body.trim().toLowerCase();
            
            if (response.includes('sí') || response.includes('si')) {
                // Redirigir al flujo correspondiente según la respuesta del usuario
                await flowDynamic('¡Perfecto! ¿En qué más puedo ayudarte hoy?');
            } else if (response.includes('no')) {
                await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día! 😊');
            } else {
                return fallBack('Lo siento, no entendí tu respuesta. ¿Podrías decirme "sí" si necesitas más información o "no" si eso es todo?');
            }
        }
    );

export default flowInstagramInfo;