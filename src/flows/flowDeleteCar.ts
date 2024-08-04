import { addKeyword } from '@builderbot/bot';
import { ObjectId } from 'mongodb';
import flowCheckCars3 from './flowCheckCars3';
import flowDeletePostOptions from './flowDeletePostOptions';

const normalizeInput = (input) => {
    return input.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const flowDeleteCar = addKeyword('/FLOWDELETECAR')
    .addAnswer(
        '¿Estás seguro de que deseas eliminar este coche? Responde con "sí" o "no".',
        { capture: true },
        async (ctx, { flowDynamic, state, fallBack, gotoFlow, database }) => {
            const response = normalizeInput(ctx.body);

            if (['sí', 'si'].includes(response)) {
                try {
                    const userId = ctx.from;
                    const selectedCarId = state.get('selectedCarId');
                    const carId = new ObjectId(selectedCarId);
                    await database.db.collection('users').deleteOne(
                        { _id: carId, phone: userId }
                    );
                    await flowDynamic('El coche ha sido eliminado exitosamente.');

                    // Redirigir al nuevo flujo para opciones posteriores a la eliminación
                    return gotoFlow(flowDeletePostOptions);
                } catch (error) {
                    console.error('Error deleting car:', error);
                    return fallBack('Hubo un error al eliminar el coche. Por favor, intenta nuevamente más tarde.');
                }
            } else if (['no', 'nó'].includes(response)) {
                return gotoFlow(flowCheckCars3); // Volver al flujo anterior si no se desea eliminar
            } else {
                return fallBack('Por favor, responde con "sí" o "no".');
            }
        }
    );

export default flowDeleteCar;
