package com.edi.pacs.fmcw_connector;

import org.reactivestreams.Publisher;
import org.reactivestreams.Subscriber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux; 
import reactor.core.publisher.Mono;

@Controller
public class MockController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MockController.class);

    @MessageMapping("fire-and-forget")
    public Mono<Void> fireAndForget(MockData mockData) {
        LOGGER.info("fireAndForget: {}", mockData.getSomeData());
        return Mono.empty();
    }

    @MessageMapping("requestAndStream")
    public Flux<MockData> requestAndStream(MockData mockDataRequest) {
        return Flux.just(mockDataRequest, mockDataRequest);
    }
}
