package com.Backend.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Required
    @Column(unique = true, nullable = false)
    private String beanId;
    @Column(nullable = false)
    private String name;

    // Optional
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

    // Many-to-many leader: product-to-flavor
    @ManyToMany
    @JoinTable(
            name = "product_flavor",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    @JsonIgnore
    private Set<Flavor> flavors = new HashSet<>();

//    // Many-to-many leader: product-to-producer
//    @ManyToMany
//    @JoinTable(
//            name = "product_producer",
//            joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "producer_id")
//    )
//    @JsonIgnore
//    private Set<Producer> producers = new HashSet<>();
//
//    // Many-to-many leader: product-to-process
//    @ManyToMany
//    @JoinTable(
//            name = "product_process",
//            joinColumns = @JoinColumn(name = "product_id"),    // <-- should reference Product
//            inverseJoinColumns = @JoinColumn(name = "process_id") // <-- should reference Process
//    )
//    @JsonIgnore
//    private Set<Process> processes;

    // Many-to-one: product-to-roaster
    @ManyToOne
    @JoinColumn(name = "roaster_id", referencedColumnName = "id")
    private Roaster roaster;

    public enum Availability {
        YES, NO
    }
}
