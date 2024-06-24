import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

export const activateBot = addKeyword<Provider, Database>('B ONE B')
    .addAction(async (ctx, { state }) => {
        await state.update({ botActive: true });
    });
