package com.sbt.bcamp.bootcamp_darkstore_provider.entities;

import com.sbt.bcamp.bootcamp_darkstore_provider.entities.pk.GoodsListPK;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "goods_list")
@IdClass(GoodsListPK.class)
public class GoodsList {
    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_good")
    private Good good;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_delivery")
    private Delivery delivery;

    @Column(name = "count")
    private int count;
}
