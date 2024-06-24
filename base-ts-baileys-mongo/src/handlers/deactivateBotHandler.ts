import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const deactivateBot = addKeyword<Provider, Database>('DEACTIVATE')
    .addAction(async (ctx, { state,endFlow,provider }) => {
        await state.update({ botActive: false });
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