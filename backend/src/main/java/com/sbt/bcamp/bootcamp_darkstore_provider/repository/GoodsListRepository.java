package com.sbt.bcamp.bootcamp_darkstore_provider.repository;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.GoodsList;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface GoodsListRepository extends CrudRepository<GoodsList,Integer> {
    Optional<GoodsList> findByGoodIdAndDeliveryId(Integer goodId, Integer deliveryId);
    Iterable<GoodsList> findAllByDeliveryId(Integer deliveryId);
}
