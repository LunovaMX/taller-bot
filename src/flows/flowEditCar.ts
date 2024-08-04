import { addKeyword } from '@builderbot/bot';
import { ObjectId } from 'mongodb';
import flowEditCarField from './flowEditCarField';

const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowEditCar = addKeyword('/FLOWEDITCAR')
    .addAnswer('Vamos a editar la información de tu coche. 😊', { capture: false })
    .addAnswer('¿Qué información deseas modificar? Responde con el número correspondiente:\n1. Marca\n2. Modelo\n3. Kilometraje\n4. Año\n5. Número de serie', { capture: true }, async (ctx, { gotoFlow,state, fallBack,flowDynamic }) => {
        const response = normalizeInput(ctx.body);

        switch (response) {
            case '1':
                await state.update({ editField: 'brand' });
                await flowDynamic('Por favor, proporciona la nueva marca del coche');
                break;
            case '2':
                await state.update({ editField: 'model' });
                await flowDynamic('Por favor, proporciona el nuevo modelo del coche');
                break;
            case '3':
                await state.update({ editField: 'mileage' });
                await flowDynamic('Por favor, proporciona el nuevo kilometraje del coche');
                break;
            case '4':
                await state.update({ editField: 'year' });
                await flowDynamic('Por favor, proporciona el nuevo año del coche');
                break;
            case '5':
                await state.update({ editField: 'serialNumber' });
                await flowDynamic('Por favor, proporciona el nuevo número de serie del coche');
                break;
            default:
                return fallBack('Por favor, responde con un número del 1 al 5 según la información que deseas modificar');
        }
        return gotoFlow(flowEditCarField)
    })
    

export default flowEditCar;
