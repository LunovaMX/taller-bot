import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowWorkshopServices = addKeyword<Provider, Database>('/FLOWWORKSHOPSERVICES')
    .addAnswer('🚗 ¡Estamos aquí para cuidar de tu vehículo! Ofrecemos una variedad de servicios para mantener tu auto en excelente estado:')
    .addAnswer(
        `🔧 Servicios que ofrecemos:
        - Frenos
        - Cambio de aceite
        - Suspensión
        - Revisión de motor
        - Lubricación
        - Afinación
        - Climas
        - ¡Y mucho más!`,
        { capture: false }
    )
    .addAnswer(
        '¿Hay algo más en lo que te pueda ayudar? 😊',
        { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            const response = ctx.body.trim().toLowerCase();
            
            if (response.includes('sí') || response.includes('si')) {
                // Redirigir al flujo correspondiente según la respuesta del usuario
                await flowDynamic('¡Perfecto! ¿En qué más puedo asistirte hoy?');
            } else if (response.includes('no')) {
                await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día! 😊');
            } else {
                return fallBack('Lo siento, no entendí tu respuesta. ¿Podrías decirme "sí" si necesitas más información o "no" si eso es todo?');
            }
        }
    );

export default flowWorkshopServices;
