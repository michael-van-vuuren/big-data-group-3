package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "Roaster")
public class Roaster {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Required table elements
    @Column(unique = true, nullable = false)
    private String name;

    private String country;

    // One-to-many: roaster-to-product
    @OneToMany(mappedBy = "roaster", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Product> products = new HashSet<>();

    public Roaster() {
    }

    public Roaster(String name, String country) {
        this.name = name;
        this.country = country;
    }
}
