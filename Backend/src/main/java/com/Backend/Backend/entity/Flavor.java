package com.Backend.Backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "Flavor")
public class Flavor {
    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Required
    @Setter
    @Column(unique = true, nullable = false)
    private String name;

    // Many-to-many follower: flavor-to-product
    @ManyToMany(mappedBy = "flavors")
    private Set<Product> products = new HashSet<>();

    public Flavor() {}

    public Flavor(String name) {
        this.name = name;
    }
}
