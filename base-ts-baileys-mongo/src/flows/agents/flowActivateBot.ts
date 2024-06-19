import { addKeyword } from '@builderbot/bot';
import { MongoAdapter as Database } from '@builderbot/database-mongo';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

const activateBotFlow = addKeyword<Provider, Database>('reactivate')
    .addAction(async (ctx, { blacklist, flowDynamic }) => {
        const clientNumber = ctx.from
        const check = blacklist.checkIf(clientNumber)
        if (check) {
            blacklist.remove(clientNumber)
            await flowDynamic(`🤖 Bot reactivado. Ahora estás hablando con el bot.`)
            return
        }
        await flowDynamic(`🔄 El bot ya está activo.`)
})

export default activateBotFlow;