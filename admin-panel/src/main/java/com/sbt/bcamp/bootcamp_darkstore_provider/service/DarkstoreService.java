package com.sbt.bcamp.bootcamp_darkstore_provider.service;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Darkstore;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordAlreadyExistException;
import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.RecordNotFoundException;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.DarkstoreRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.repository.DarkstoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DarkstoreService {
    @Autowired
    private DarkstoreRepository repository;

    public Iterable<Darkstore> getAllDarkstores() {
        return repository.findAll();
    }

    public Darkstore getDarkstoreById(int id) {
        return repository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);
    }

    public void createDarkstore(DarkstoreRequest darkstoreRequest) {
        Darkstore darkstore = new Darkstore(0, darkstoreRequest.address());
        repository.save(darkstore);
    }

    public void updateDarkstore(Darkstore darkstore) {
        repository
                .findById(darkstore.getId())
                .orElseThrow(RecordNotFoundException::new);

        repository.save(darkstore);
    }

    public void deleteDarkstore(int id) {
        repository
                .findById(id)
                .orElseThrow(RecordNotFoundException::new);

        repository.deleteById(id);
    }
}
