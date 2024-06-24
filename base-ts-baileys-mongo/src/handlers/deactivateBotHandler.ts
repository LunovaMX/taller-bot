import {addKeyword} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

export const deactivateBot = addKeyword<Provider, Database>('DEACTIVATE')
    .addAction(async (ctx, { state }) => {
        await state.update({ botActive: false });
    });