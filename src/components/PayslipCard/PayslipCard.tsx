import { PayslipCardAction } from './PayslipCardAction';
import { PayslipCardDate } from './PayslipCardDate';
import { PayslipCardFrame } from './PayslipCardFrame';
import { PayslipCardID } from './PayslipCardID';
import { PayslipCardProvider } from './PayslipCardProvider';

interface PayslipCardComponent {
  Provider: typeof PayslipCardProvider;
  Frame: typeof PayslipCardFrame;
  ID: typeof PayslipCardID;
  Date: typeof PayslipCardDate;
  Action: typeof PayslipCardAction;
}

// Main component that combines all parts
export const PayslipCard: PayslipCardComponent = {
  Provider: PayslipCardProvider,
  Frame: PayslipCardFrame,
  ID: PayslipCardID,
  Date: PayslipCardDate,
  Action: PayslipCardAction,
};

export { PayslipCardAction, PayslipCardDate, PayslipCardFrame, PayslipCardID, PayslipCardProvider };

