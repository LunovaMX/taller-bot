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
    flowDeleteCar,
    flowDeletePostOptions,
} from './index';
import { logPhoneNumber, removePhoneNumber } from './handlers/phoneLogger';




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
            flowDeleteCar,
            flowDeletePostOptions,
            
        ]);

        const adapterProvider = createProvider(Provider,{
            usePairingCode: true, 
            phoneNumber: PHONE_NUMBER,
            experimentalStore: true,  // Significantly reduces resource consumption
            timeRelease: 10800000, });
            
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
            const messageText = ctx.body.trim().toLowerCase();

            if (messageText === 'activar bot') {
                await provider.vendor.chatModify(
                    {
                        removeChatLabel: {
                            labelId: '1', // Reemplaza con el ID real de la etiqueta "humano"
                        }
                    },
                    ctx.key.remoteJid
                );
                await removePhoneNumber(ctx.from); // Eliminar el número de teléfono del archivo
            } else {
                await provider.vendor.chatModify(
                    {
                        addChatLabel: {
                            labelId: '1' // Reemplaza con el ID real de la etiqueta "HUMAN"
                        }
                    },
                    ctx.key.remoteJid
                );
                await logPhoneNumber(ctx.from); // Registrar el número de teléfono en el archivo
            } 
        });
        

        initializeServer(provider, handleCtx);



        httpServer(+PORT);
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
};

main();
