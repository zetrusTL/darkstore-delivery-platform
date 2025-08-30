package com.sbt.bcamp.bootcamp_darkstore_provider.in;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Good;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.GoodRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class GoodController {
    @Autowired
    private GoodService service;

    @GetMapping("/good")
    public ResponseEntity<Iterable<Good>> getAllGoods() {
        return ResponseEntity.ok(service.getAllGoods());
    }

    @GetMapping("/good/{id}")
    public ResponseEntity<Good> getGoodById(@PathVariable int id) {
        return ResponseEntity.ok(service.getGoodById(id));
    }

    @PostMapping("/good")
    public ResponseEntity<Void> createGood(@RequestBody GoodRequest goodRequest) {
        service.createGood(goodRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/good")
    public ResponseEntity<Void> updateGood(@RequestBody Good good) {
        service.updateGood(good);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/good/{id}")
    public ResponseEntity<Void> deleteGood(@PathVariable int id) {
        service.deleteGood(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
