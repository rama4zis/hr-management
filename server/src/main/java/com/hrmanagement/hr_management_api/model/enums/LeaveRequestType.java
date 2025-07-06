package com.hrmanagement.hr_management_api.model.enums;

public enum LeaveRequestType {
    ANNUAL("Annual Leave", 21),
    SICK("Sick Leave", 14),
    PERSONAL("Personal Leave", 7),
    MATERNITY("Maternity Leave", 90),
    PATERNITY("Paternity Leave", 14),
    BEREAVEMENT("Bereavement Leave", 5),
    EMERGENCY("Emergency Leave", 3);
    
    private final String displayName;
    private final Integer maxDaysPerYear;
    
    LeaveRequestType(String displayName, Integer maxDaysPerYear) {
        this.displayName = displayName;
        this.maxDaysPerYear = maxDaysPerYear;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public Integer getMaxDaysPerYear() {
        return maxDaysPerYear;
    }
    
    public Boolean isMaternityOrPaternity() {
        return this == MATERNITY || this == PATERNITY;
    }
}
