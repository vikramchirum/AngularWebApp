export interface MonthlyProfiledBill {
    UsageMonth: Date,
    StartDate: Date,
    EndDate: Date,
    KwHours: number,
    TotalCharge: number,
    EnergyCharge: number
}

export interface DailyProfiledBill {
    UsageDate: Date,
    KwHours: number,
    TotalCharge: number,
    EnergyCharge: number
}

export interface HourlyProfiledBill {
    Hour: number,
    KwHours: number,
    TotalCharge: number,
    EnergyCharge: number
}