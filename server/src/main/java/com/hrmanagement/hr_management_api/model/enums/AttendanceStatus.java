package com.hrmanagement.hr_management_api.model.enums;

public enum AttendanceStatus {
    PRESENT("Present"),
    ABSENT("Absent"),
    LATE("Late"),
    HALF_DAY("Half Day"),
    OVERTIME("Overtime"),
    WORK_FROM_HOME("Work From Home");
    
    private final String displayName;
    
    AttendanceStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isPresent() {
        return this == PRESENT || this == LATE || this == HALF_DAY || this == OVERTIME || this == WORK_FROM_HOME;
    }
}
