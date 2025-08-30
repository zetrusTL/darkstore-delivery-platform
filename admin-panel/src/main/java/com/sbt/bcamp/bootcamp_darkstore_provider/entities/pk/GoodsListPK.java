package com.sbt.bcamp.bootcamp_darkstore_provider.entities.pk;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Delivery;
import com.sbt.bcamp.bootcamp_darkstore_provider.entities.Good;
import lombok.Data;

@Data
public class GoodsListPK {
    private Good good;
    private Delivery delivery;
}
