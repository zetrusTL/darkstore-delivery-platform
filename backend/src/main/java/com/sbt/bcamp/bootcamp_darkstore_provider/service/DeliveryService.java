package com.sbt.bcamp.bootcamp_darkstore_provider.service;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Darkstore;
import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Delivery;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.DarkstoreNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordAlreadyExistException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.DeliveryRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.DarkstoreRepository;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DarkstoreRepository darkstoreRepository;

    public Iterable<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Delivery getDeliveryById(int id) {
        return deliveryRepository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);
    }

    private void saveDelivery(DeliveryRequest deliveryRequest) {
        Darkstore darkstore = darkstoreRepository
                .findById(deliveryRequest.darkstoreId())
                .orElseThrow(DarkstoreNotFoundException::new);

        Delivery delivery = new Delivery(deliveryRequest.id(),
                darkstore,
                deliveryRequest.deliveryDateTime(),
                deliveryRequest.status());

        deliveryRepository.save(delivery);
    }

    public void createDelivery(DeliveryRequest deliveryRequest) {
        Delivery record = deliveryRepository
                .findById(deliveryRequest.id())
                .orElse(null);

        if (record != null) {
            throw new RecordAlreadyExistException();
        }

        saveDelivery(deliveryRequest);
    }

    public void updateDelivery(DeliveryRequest deliveryRequest) {
        deliveryRepository
                .findById(deliveryRequest.id())
                .orElseThrow(RecordNotFoundException::new);

        saveDelivery(deliveryRequest);
    }

    public void deleteDelivery(int id) {
        deliveryRepository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);

        deliveryRepository.deleteById(id);
    }
}
