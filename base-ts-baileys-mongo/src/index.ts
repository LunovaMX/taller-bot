import flowNewCar from './flows/flowNewCar';
import flowWorkshopServices from './flows/flowServices';
import flowContactInfo from './flows/flowContactInfo';
import flowInstagramInfo from './flows/flowInstagramInfo';
import flowLocationInfo from './flows/flowLocationInfo';
import flowWelcome from './flows/flowWelcome';

import flowDescribeProblem from './flows/flowDescribeProblem';

import  activateBot  from './handlers/activateBotHandler';
import  deactivateBot  from './handlers/deactivateBotHandler';
import  humanFlow  from './handlers/botAgent'


export {
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