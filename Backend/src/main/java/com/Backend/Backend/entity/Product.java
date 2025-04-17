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
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long beanId;

    private String name;

    private String roastDegree;

    @Column(precision = 8, scale = 2)
    private BigDecimal price;

    @Column(precision = 8, scale = 2)
    private BigDecimal gram;

    @Column(precision = 8, scale = 2)
    private BigDecimal pricePerCup;

    @Column(precision = 8, scale = 2)
    private BigDecimal bulkPricePerCup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Availability availability;
    public enum Availability { YES, NO }

    @Column(length = 500)
    private String webpage;

    @Column(length = 500)
    private String image;

    @ManyToOne
    @JoinColumn(name = "roaster_id", referencedColumnName = "id")
    private Roaster roaster;

    @ManyToOne
    @JoinColumn(name = "process_id", referencedColumnName = "id")
    private Process process;

    @ManyToMany
    @JoinTable(
            name = "product_flavor",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    private Set<Flavor> flavors = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "product_producer",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "producer_id")
    )
    private Set<Producer> producers = new HashSet<>();

    @ManyToMany(mappedBy = "favoriteProducts", fetch = FetchType.LAZY)
    private Set<Account> favoritedByAccounts = new HashSet<>();

    public Product() {
        this.availability = Availability.NO;
    }

    public Product(String name, Roaster roaster, Process process) {
        this();
        this.name = name;
        this.roaster = roaster;
        this.process = process;
    }

    public void addFlavor(Flavor flavor) {
        this.flavors.add(flavor);
        flavor.getProducts().add(this);
    }

    public void addProducer(Producer producer) {
        this.producers.add(producer);
        producer.getProducts().add(this);
    }
}