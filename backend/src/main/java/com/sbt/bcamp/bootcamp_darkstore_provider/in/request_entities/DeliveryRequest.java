package com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities;

import com.sbt.bcamp.bootcamp_darkstore_provider.Status;
import java.time.LocalDateTime;

public record DeliveryRequest(
        int id,
        int darkstoreId,
        LocalDateTime deliveryDateTime,
        Status status
) {}
