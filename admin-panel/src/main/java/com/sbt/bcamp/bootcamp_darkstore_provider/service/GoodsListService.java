package com.sbt.bcamp.bootcamp_darkstore_provider.service;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Delivery;
import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Good;
import com.sbt.bcamp.bootcamp_darkstore_provider.entities.GoodsList;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.DeliveryNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.GoodNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordAlreadyExistException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.GoodsListRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.DeliveryRepository;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.GoodRepository;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.GoodsListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoodsListService {
    @Autowired
    private GoodsListRepository goodsListRepository;

    @Autowired
    private GoodRepository goodRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;


    public Iterable<GoodsList> getAllGoodsList() {
        return goodsListRepository.findAll();
    }

    public GoodsList getGoodsListById(int goodId, int deliveryId) {
        return goodsListRepository
                .findByGoodIdAndDeliveryId(goodId, deliveryId)
                .orElseThrow(RecordNotFoundException::new);
    }

    public Iterable<GoodsList> getAllGoodsListByDeliveryId(int deliveryId) {
        return goodsListRepository.findAllByDeliveryId(deliveryId);
    }

    private void saveGoodsList(GoodsListRequest goodsListRequest) {
        int goodId = goodsListRequest.goodId();
        int deliveryId = goodsListRequest.deliveryId();

        Good good = goodRepository
                .findById(goodId)
                .orElseThrow(GoodNotFoundException::new);

        Delivery delivery = deliveryRepository
                .findById(deliveryId)
                .orElseThrow(DeliveryNotFoundException::new);

        GoodsList goodsList = new GoodsList(good, delivery, goodsListRequest.count());

        goodsListRepository.save(goodsList);
    }

    public void createGoodsList(GoodsListRequest goodsListRequest) {
        int goodId = goodsListRequest.goodId();
        int deliveryId = goodsListRequest.deliveryId();

        GoodsList record = goodsListRepository
                .findByGoodIdAndDeliveryId(goodId, deliveryId)
                .orElse(null);

        if (record != null) {
            throw new RecordAlreadyExistException();
        }

        saveGoodsList(goodsListRequest);
    }

    public void updateGoodsList(GoodsListRequest goodsListRequest) {
        int goodId = goodsListRequest.goodId();
        int deliveryId = goodsListRequest.deliveryId();

        goodsListRepository
                .findByGoodIdAndDeliveryId(goodId, deliveryId)
                .orElseThrow(RecordNotFoundException::new);

        saveGoodsList(goodsListRequest);
    }

    public void deleteGoodsList(int goodId, int deliveryId) {
        GoodsList goodsList = goodsListRepository
                .findByGoodIdAndDeliveryId(goodId, deliveryId)
                .orElseThrow(RecordNotFoundException::new);

        goodsListRepository.delete(goodsList);
    }
}
