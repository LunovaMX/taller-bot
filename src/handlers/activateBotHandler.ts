import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { removePhoneNumber, logPhoneNumber } from './phoneLogger';

const activateBot = addKeyword<Provider, Database>('/ACTIVATEBOT')
    .addAction(async (ctx, { state, provider }) => {
        await state.update({ botActive: true });

        await removePhoneNumber(ctx.from); // Eliminar el número de teléfono del archivo

        await provider.vendor.chatModify(
            {
                removeChatLabel: {
                    labelId: '1' // Reemplaza con el ID real de la etiqueta "humano"
                }
            },
            ctx.key.remoteJid
        );
    });

export default activateBot
