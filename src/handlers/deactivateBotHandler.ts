import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { logPhoneNumber } from './phoneLogger';

const deactivateBot = addKeyword<Provider, Database>('/DEACTIVATEBOT')
    .addAction(async (ctx, { endFlow,provider }) => {
        await logPhoneNumber(ctx.from); // Registrar el número de teléfono en el archivo
        await provider.vendor.chatModify(
            {
                addChatLabel: {
                    labelId: '1' // Reemplaza con el ID real de la etiqueta "HUMAN"
                }
            },
            ctx.key.remoteJid
        );
        return endFlow()
    });
export default deactivateBot