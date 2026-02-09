package com.example.cms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ContactManagementSystem {

	public static void main(String[] args) {
		SpringApplication.run(ContactManagementSystem.class, args);
	}

}
