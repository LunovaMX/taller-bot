import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MongoAdapter as Database } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import * as dotenv from 'dotenv';

import {
    flowNewCar,
    flowWorkshopServices,
    flowContactInfo,
    flowInstagramInfo,
    flowLocationInfo,
    flowWelcome,
    deactivateBotFlow, 
    activateBotFlow
} from './index';



dotenv.config();

const PORT = process.env.PORT ?? 3008

const discordFlow = addKeyword<Provider, Database>('doc').addAnswer(
    ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
        '\n'
    ),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
        if (ctx.body.toLocaleLowerCase().includes('yes')) {
            return gotoFlow(registerFlow)
        }
        await flowDynamic('Thanks!')
        return
    }
)

const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer('🙌 ¡Hola! Bienvenido a nuestro *Chatbot*.')
    .addAnswer(
        [
            '¿En qué puedo ayudarte hoy?',
            '1. Generar una cotización',
            '2. Servicios de taller',
            '3. Información de contacto',
            '4. Información de nuestro Instagram',
            '5. Ubicación de nuestro taller',
            'Por favor, escribe el número de tu elección:'
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            const choice = ctx.body.trim();
            switch (choice) {
                case '1':
                    return gotoFlow(flowNewCar);
                case '2':
                    return gotoFlow(flowWorkshopServices);
                case '3':
                    return gotoFlow(flowContactInfo);
                case '4':
                    return gotoFlow(flowInstagramInfo);
                case '5':
                    return gotoFlow(flowLocationInfo);
                default:
                    return fallBack('Lo siento, no entendí tu elección. Por favor, escribe un número válido (1-5).');
            }
        }
    );
const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
    })
    .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
    })
    .addAction(async (_, { flowDynamic, state }) => {
        await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
    })

const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })




const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow, 
        registerFlow, 
        fullSamplesFlow, 
        flowNewCar, 
        flowWorkshopServices,
        flowContactInfo,
        flowInstagramInfo,
        flowLocationInfo,
        deactivateBotFlow, 
        activateBotFlow
    ])
    
    const adapterProvider = createProvider(Provider)
        const adapterDB = new Database({
        dbUri: process.env.MONGO_DB_URI as string,
        dbName: process.env.MONGO_DB_NAME as string,
    })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
        
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
