package com.sbt.bcamp.bootcamp_darkstore_provider.service;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Good;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordAlreadyExistException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.GoodRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.GoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoodService {
    @Autowired
    private GoodRepository repository;

    public Iterable<Good> getAllGoods() {
        return repository.findAll();
    }

    public Good getGoodById(int id) {
        return repository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);
    }

    public void createGood(GoodRequest goodRequest) {
        Good good = new Good(0, goodRequest.name(), goodRequest.price());
        repository.save(good);
    }

    public void updateGood(Good good) {
        repository
                .findById(good.getId())
                .orElseThrow(RecordNotFoundException::new);

        repository.save(good);
    }

    public void deleteGood(int id) {
        Good record = repository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);

        repository.delete(record);
    }
}
