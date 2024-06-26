import flowNewCar from './flows/flowNewCar';
import flowWorkshopServices from './flows/flowServices';
import flowContactInfo from './flows/flowContactInfo';
import flowInstagramInfo from './flows/flowInstagramInfo';
import flowLocationInfo from './flows/flowLocationInfo';
import flowWelcome from './flows/flowWelcome';
import flowCheckCars from './flows/flowCheckCars';

import flowDescribeProblem from './flows/flowDescribeProblem';

import  activateBot  from './handlers/activateBotHandler';
import  deactivateBot  from './handlers/deactivateBotHandler';
import  humanFlow  from './handlers/botAgent'


export {
    flowCheckCars,
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
    
};