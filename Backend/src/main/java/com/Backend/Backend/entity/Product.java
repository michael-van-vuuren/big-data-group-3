package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

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

    @Column(length = 400)
    private String webpage;

    @Column(length = 400)
    private String image;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    public enum Availability {
        YES, NO
    }

    @ManyToMany
    @JoinTable(
            name = "product_flavor",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    private Set<Flavor> flavors = new HashSet<>();
}
