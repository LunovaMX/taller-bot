import flowNewCar from './flows/flowNewCar';
import flowWorkshopServices from './flows/flowServices';
import flowContactInfo from './flows/flowContactInfo';
import flowInstagramInfo from './flows/flowInstagramInfo';
import flowLocationInfo from './flows/flowLocationInfo';
import flowWelcome from './flows/flowWelcome';
import deactivateBotFlow from './flows/agents/flowActivateBot';
import activateBotFlow from './flows/agents/flowDeactiveBot';
import flowDescribeProblem from './flows/flowDescribeProblem';

export { activateBot } from './handlers/activateBotHandler';
export { deactivateBot } from './handlers/deactivateBotHandler';
import  humanFlow  from './handlers/botAgent'


export {
    flowNewCar,
    flowWorkshopServices,
    flowContactInfo,
    flowInstagramInfo,
    flowLocationInfo,
    flowWelcome,
    deactivateBotFlow, 
    activateBotFlow,
    flowDescribeProblem,
    humanFlow,
};