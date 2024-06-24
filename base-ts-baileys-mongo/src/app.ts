import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { PORT, MONGO_DB_URI, MONGO_DB_NAME } from './config';
import { initializeServer } from './server/initializeServer';
import {
    activateBot,
    deactivateBot,
    flowWelcome,
    flowNewCar,
    flowWorkshopServices,
    flowContactInfo,
    flowInstagramInfo,
    flowLocationInfo,
    deactivateBotFlow,
    activateBotFlow,
    flowDescribeProblem,
    humanFlow
} from './index';

const main = async () => {
    try {
        const adapterFlow = createFlow([
            flowWelcome,
            flowNewCar,
            flowWorkshopServices,
            flowContactInfo,
            flowInstagramInfo,
            flowLocationInfo,
            deactivateBotFlow,
            activateBotFlow,
            flowDescribeProblem,
            activateBot,
            deactivateBot,
            humanFlow
        ]);

        const adapterProvider = createProvider(Provider);
        const adapterDB = new Database({
            dbUri: MONGO_DB_URI,
            dbName: MONGO_DB_NAME,
        });

        const { handleCtx, httpServer, provider } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        initializeServer(provider, handleCtx);

        httpServer(+PORT);
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
};

main();
