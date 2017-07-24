export interface IPricingDefinition {
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [ ICharges ];
  Usage_Credits: [ ICharges ];
  Usage_Charges: [ ICharges ];
  Has_Early_Termination_Fee: boolean;
  Has_Base_Charge: boolean;
  Has_Monthly_Service_Fees: boolean;
  Energy_Charge_Count: number;
  Usage_Credit_Count: number;
  Usage_Charge_Count: number;
}

export interface ICharges {
  Min: number;
  Max: number;
  Amount: number;
}
