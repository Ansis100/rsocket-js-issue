package com.edi.pacs.fmcw_connector;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class FmcwConnectorApplication {

	public static void main(String[] args) {
		SpringApplication.run(FmcwConnectorApplication.class, args);
	}

}
