package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "country")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "countries")
    private Set<Producer> producers = new HashSet<>();

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL)
    private List<Roaster> roasters = new ArrayList<>();

    public Country(String name) {
        this.name = name;
    }

    public Country(String name, Set<Producer> producers) {
        this.name = name;
        this.producers = producers;
    }
}