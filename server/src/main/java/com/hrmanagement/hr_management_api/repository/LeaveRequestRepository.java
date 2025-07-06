package com.hrmanagement.hr_management_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

}
