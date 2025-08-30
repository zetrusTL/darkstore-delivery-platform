package com.sbt.bcamp.bootcamp_darkstore_provider.in;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Darkstore;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.DarkstoreRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.service.DarkstoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class DarkstoreController {
    @Autowired
    private DarkstoreService service;

    @GetMapping("/darkstore")
    public ResponseEntity<Iterable<Darkstore>> getAllDarkstores() {
        return ResponseEntity.ok(service.getAllDarkstores());
    }

    @GetMapping("/darkstore/{id}")
    public ResponseEntity<Darkstore> getDarkstoreById(@PathVariable int id) {
        Darkstore darkstore = service.getDarkstoreById(id);
        if (darkstore != null) {
            return ResponseEntity.ok(darkstore);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/darkstore")
    public ResponseEntity<Void> createDarkstore(@RequestBody DarkstoreRequest darkstoreRequest) {
        service.createDarkstore(darkstoreRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/darkstore")
    public ResponseEntity<Void> updateDarkstore(@RequestBody Darkstore darkstore) {
        service.updateDarkstore(darkstore);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/darkstore/{id}")
    public ResponseEntity<Void> deleteDarkstore(@PathVariable int id) {
        service.deleteDarkstore(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
