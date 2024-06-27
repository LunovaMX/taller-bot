import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { PORT, MONGO_DB_URI, MONGO_DB_NAME, PHONE_NUMBER } from './config';
import { initializeServer } from './server/initializeServer';
import {
    flowNewCar,
    flowWorkshopServices,
    flowContactInfo,
    flowInstagramInfo,
    flowLocationInfo,
    flowWelcome,
    deactivateBot, 
    activateBot,
    flowDescribeProblem,
    humanFlow,
    flowCheckCars,
    flowCheckCars2,
    flowCheckCars3,
    flowEditCar,
    flowEditCarField,
    flowEditCarConfirmation,
} from './index';




const main = async () => {
    try {
        const adapterFlow = createFlow([
            flowWelcome,
            flowCheckCars,
            flowCheckCars2,
            flowCheckCars3,
            flowEditCar,
            flowEditCarField,
            flowEditCarConfirmation,
            flowNewCar,
            flowWorkshopServices,
            flowContactInfo,
            flowInstagramInfo,
            flowLocationInfo,
            deactivateBot,
            activateBot,
            flowDescribeProblem,
            humanFlow,
        ]);

        const adapterProvider = createProvider(Provider,{usePairingCode: true, phoneNumber: PHONE_NUMBER });
        const adapterDB = new Database({
            dbUri: MONGO_DB_URI,
            dbName: MONGO_DB_NAME,
        });

        const { handleCtx, httpServer, provider } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });


        // Manejador para los mensajes enviados por ti
        // TODO apagar el bot en cuanto se escriba un mensaje propio
        provider.on('FromMe', async (ctx) => {
            console.log('Msg: ', ctx);
            console.log('From: ', ctx.from);
        });
        

        initializeServer(provider, handleCtx);



        httpServer(+PORT);
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
};

main();
