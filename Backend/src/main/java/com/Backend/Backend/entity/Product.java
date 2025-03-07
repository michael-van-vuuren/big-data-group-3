package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "Product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String beanId;

    @Column(nullable = false)
    private String name;

    private String roastDegree;

    private BigDecimal price;

    private int gram;

    private BigDecimal pricePerCup;

    private BigDecimal bulkPricePerCup;

    private String webpage;

    private String image;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    public enum Availability {
        YES, NO
    }
}
