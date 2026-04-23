package com.exclusive.blank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.exclusive.blank.repository")
public class SmartRegistrationApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRegistrationApplication.class, args);
    }
}
