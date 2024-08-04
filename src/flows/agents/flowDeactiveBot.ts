import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const deactivateBotFlow = addKeyword<Provider, Database>('agent')
    .addAction(async (ctx, { blacklist, flowDynamic }) => {
        const clientNumber = ctx.from
        const check = blacklist.checkIf(clientNumber)
        if (!check) {
            blacklist.add(clientNumber)
            await flowDynamic(`🤖 Bot desactivado. Ahora estás hablando con un agente.`)
            return
        }
        await flowDynamic(`🔄 Ya estás hablando con un agente.`)
})


export default deactivateBotFlow;