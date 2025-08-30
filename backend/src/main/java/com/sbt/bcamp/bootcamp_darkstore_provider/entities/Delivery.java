package com.sbt.bcamp.bootcamp_darkstore_provider.entities;

import com.sbt.bcamp.bootcamp_darkstore_provider.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_darkstore")
    private Darkstore darkstore;

    @Column(name = "datetime_delivery")
    private LocalDateTime deliveryDatetime;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;
}
