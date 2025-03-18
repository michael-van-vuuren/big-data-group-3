package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(unique = true, nullable = false)
    private String beanId;

    private String name;
    private String roastDegree;

    @ManyToOne
    @JoinColumn(name = "roaster_id", referencedColumnName = "id")
    private Roaster roaster;

    @ManyToMany
    @JoinTable(
            name = "product_flavor",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    private Set<Flavor> flavors = new HashSet<>();
}
