package com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities;

public record GoodsListRequest(
        int goodId,
        int deliveryId,
        int count
) {}
