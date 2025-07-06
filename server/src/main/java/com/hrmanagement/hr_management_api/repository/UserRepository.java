package com.hrmanagement.hr_management_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrmanagement.hr_management_api.model.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

}
