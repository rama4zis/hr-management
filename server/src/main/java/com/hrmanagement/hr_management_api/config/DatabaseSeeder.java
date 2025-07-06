package com.hrmanagement.hr_management_api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private DataLoder dataLoder;

    @Override
    public void run(String... args) throws Exception {
        dataLoder.loadData();
    }

}
