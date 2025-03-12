package com.Backend.Backend.entity;

import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @Column(nullable = false)
    private String country;

    @ManyToMany(mappedBy = "roasters")
    private Set<Product> products = new HashSet<>();

    public Roaster() {}

    public Roaster(String name, String country) {
        this.name = name;
        this.country = country;
    }
}
