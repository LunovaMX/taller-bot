import { addKeyword } from '@builderbot/bot';
import flowEditCarConfirmation from './flowEditCarConfirmation';


const flowEditCarField = addKeyword(['editar campo'])
    .addAnswer('Ingrese el nuevo valor:', { capture: true }, async (ctx, { state, fallBack, flowDynamic, gotoFlow }) => {
        console.log('Editfield')
        const editField = state.get('editField');
        const newValue = ctx.body.trim();

        if (editField === 'mileage') {
            const mileageNumber = parseInt(newValue, 10);
            if (isNaN(mileageNumber) || mileageNumber < 0) {
                return fallBack('Por favor, ingresa un *número válido* para el kilometraje del coche.');
            }
            await state.update({ mileage: mileageNumber });
        } else if (editField === 'year') {
            const yearNumber = parseInt(newValue, 10);
            const currentYear = new Date().getFullYear();
            if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > currentYear) {
                return fallBack(`Por favor, ingresa un *año válido* (entre 1900 y ${currentYear}).`);
            }
            await state.update({ year: yearNumber });
        } else if (editField === 'serialNumber' && newValue.length !== 17) {
            return fallBack('El **VIN** debe tener 17 caracteres alfanuméricos sin espacios.');
        } else {
            await state.update({ [editField]: newValue });
        }

        const brand = state.get('brand');
        const model = state.get('model');
        const mileage = state.get('mileage');
        const year = state.get('year');
        const serialNumber = state.get('serialNumber');

        const confirmationMessage = `Marca: ${brand}\nModelo: ${model}\nKilometraje: ${mileage}\nAño: ${year}\nNúmero de Serie: ${serialNumber}`;
        await flowDynamic(`Aquí está la información actualizada:\n\n${confirmationMessage}`);

        return gotoFlow(flowEditCarConfirmation);
    });

export default flowEditCarField;
