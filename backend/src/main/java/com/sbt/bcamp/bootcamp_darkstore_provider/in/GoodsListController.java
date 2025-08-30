package com.sbt.bcamp.bootcamp_darkstore_provider.in;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.GoodsList;
import com.sbt.bcamp.bootcamp_darkstore_provider.in.request_entities.GoodsListRequest;
import com.sbt.bcamp.bootcamp_darkstore_provider.service.GoodsListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class GoodsListController {
    @Autowired
    private GoodsListService service;

    @GetMapping("/goodslist")
    public ResponseEntity<Iterable<GoodsList>> getAllGoodsList() {
        return ResponseEntity.ok(service.getAllGoodsList());
    }

    @GetMapping("/goodslist/delivery/{id}")
    public ResponseEntity<Iterable<GoodsList>> getAllGoodsListByDeliveryId(@PathVariable int id){
        return ResponseEntity.ok(service.getAllGoodsListByDeliveryId(id));
    }

    @GetMapping("/goodslist/{goodId}/{deliveryId}")
    public ResponseEntity<GoodsList> getGoodsListById(@PathVariable int goodId,
                                                      @PathVariable int deliveryId) {
        return ResponseEntity.ok(service.getGoodsListById(goodId, deliveryId));
    }

    @PostMapping("/goodslist")
    public ResponseEntity<Void> createGoodsList(@RequestBody GoodsListRequest goodsList) {
        service.createGoodsList(goodsList);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/goodslist")
    public ResponseEntity<Void> updateGoodsList(@RequestBody GoodsListRequest goodsList) {
        service.updateGoodsList(goodsList);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/goodslist/{goodId}/{deliveryId}")
    public ResponseEntity<Void> deleteGoodsList(@PathVariable int goodId,
                                                @PathVariable int deliveryId) {
        service.deleteGoodsList(goodId, deliveryId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
