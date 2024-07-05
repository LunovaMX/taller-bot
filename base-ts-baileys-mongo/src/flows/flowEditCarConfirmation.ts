import { addKeyword } from '@builderbot/bot';
import { ObjectId } from 'mongodb';
import flowEditCar from './flowEditCar';
import flowDescribeProblem from './flowDescribeProblem';

const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowEditCarConfirmation = addKeyword('/FLOWEDITCARCONFIRMATION')
    .addAnswer('¿Es correcta esta información? Responde con "sí" o "no"', { capture: true }, async (ctx, { state, fallBack, flowDynamic, database, gotoFlow }) => {
        const response = normalizeInput(ctx.body);
        const selectedCarId = state.get('selectedCarId');

        if (response === 'si' || response === 'sí') {
            const updatedCar = {
                phone: ctx.from,
                brand: state.get('brand'),
                model: state.get('model'),
                mileage: state.get('mileage'),
                year: state.get('year'),
                serialNumber: state.get('serialNumber'),
            };

            try {
                // Asegúrate de que la estructura del documento y la consulta de actualización coincidan
                await database.db.collection('users').updateOne(
                    { _id: new ObjectId(selectedCarId) },
                    { $set: updatedCar }
                );

                await flowDynamic('¡Perfecto! La información ha sido actualizada correctamente. Gracias. 😊');
                return gotoFlow(flowDescribeProblem);
            } catch (error) {
                console.error('Error al actualizar la información del coche:', error);
                await flowDynamic('Lo siento, hubo un error al actualizar la información del coche. Por favor, intenta nuevamente.');
            }
        } else if (response === 'no') {
            await flowDynamic('Entiendo, vamos a ingresar la información nuevamente.');
            return gotoFlow(flowEditCar);
        } else {
            return fallBack('Por favor, responde con "sí" si la información es correcta o "no" si deseas corregirla.');
        }
        return gotoFlow(flowDescribeProblem)
    });

export default flowEditCarConfirmation;
