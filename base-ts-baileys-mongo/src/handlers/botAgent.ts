import {addKeyword,EVENTS} from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

import {flowWelcome} from '../index';



const humanFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAction(async (ctx, { state, endFlow, gotoFlow }) => {
        console.log( ctx);

        const userBotStatus = await state.get('botActive');
        if (userBotStatus === undefined) {
            await state.update({ botActive: true });
            return gotoFlow(flowWelcome);
        } else if (!userBotStatus) {
            return endFlow(); // End flow if the bot is not activated
        }
        return gotoFlow(flowWelcome);
    });

export default humanFlow