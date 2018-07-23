export interface UsageComparison {
    Uan: string,
    Days_InTo_Current_Cycle: number,
    Meter_Read_Cycles: MeterReadCycle[],
    Daily_Usage_List: DailyUsage[]
}

export interface MeterReadCycle {
    Usage_Month: Date,
    Start_Date: Date,
    End_Date: Date,
    Usage: number,
    Usage_Type: string
}

export interface DailyUsage {
    Date: Date,
    Usage: number,
    Source: string
}