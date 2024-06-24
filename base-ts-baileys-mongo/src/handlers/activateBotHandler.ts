import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const activateBot = addKeyword<Provider, Database>('B ONE B')
    .addAction(async (ctx, { state, provider }) => {
        await state.update({ botActive: true });
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
