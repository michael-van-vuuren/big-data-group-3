package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Entity
@Table(name = "Flavor")
public class Flavor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Setter
    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "flavors")
    private Set<Product> products = new HashSet<>();

    public Flavor() {}

    public Flavor(String name) {
        this.name = name;
    }
}
