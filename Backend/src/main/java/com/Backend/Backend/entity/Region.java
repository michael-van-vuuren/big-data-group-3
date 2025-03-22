package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "region")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "regions")
    private Set<Producer> producers = new HashSet<>();

    public Region(String name) {
        this.name = name;
    }

    public Region(String name, Set<Producer> producers) {
        this.name = name;
        this.producers = producers;
    }
}