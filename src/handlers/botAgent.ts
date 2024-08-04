import { addKeyword, EVENTS } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { flowWelcome } from '../index';
import { extractPhoneNumber, isPhoneNumberInFile } from '../handlers/phoneLogger';

const humanFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAction(async (ctx, { endFlow, gotoFlow }) => {
        const cleanPhoneNumber = extractPhoneNumber(ctx.from);

        if (await isPhoneNumberInFile(cleanPhoneNumber)) {
            return endFlow(); // End flow if the phone number is in the file
        }

        return gotoFlow(flowWelcome);
    });

export default humanFlow;
