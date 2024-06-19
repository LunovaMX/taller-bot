import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const flowContactInfo = addKeyword<Provider, Database>(['contacto', 'informacion de contacto'])
    .addAnswer('¡Hola! 😊 Si necesitas contactarnos, puedes llamarnos al número 81 1481 8453', { capture: false })
    .addAnswer('También puedes enviarnos un correo electrónico a bone.automotriz@gmail.com.', { capture: false })
    .addAnswer('Si prefieres hablar con uno de nuestros agentes por este medio, escribe la palabra "agente".', { capture: false })
    .addAnswer('¿Hay algo más en lo que te pueda ayudar hoy?', { capture: true }, async (ctx, { fallBack, flowDynamic }) => {
        const response = ctx.body.trim().toLowerCase();
        
        if (response.includes('sí') || response.includes('si')) {
            await flowDynamic('¡Perfecto! Por favor, dime en qué más puedo ayudarte.');
            // Aquí podrías redirigir a otro flujo según la necesidad del usuario
        } else if (response.includes('no')) {
            await flowDynamic('Gracias por tu consulta. ¡Que tengas un excelente día! 🌞');
        } else if (response.includes('agente')) {
            await flowDynamic('Te estoy conectando con uno de nuestros agentes. Por favor, espera un momento...');
            // Aquí podrías redirigir a un flujo para conectar con un agente
        } else {
            return fallBack('No entendí tu respuesta, por favor dime "sí" si necesitas más información, "no" si eso es todo, o "agente" si prefieres hablar con uno de nuestros agentes.');
        }
    });

export default flowContactInfo;

