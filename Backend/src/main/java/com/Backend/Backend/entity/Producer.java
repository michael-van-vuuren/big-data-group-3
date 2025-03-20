package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "producer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String elevation;

    private String tags;

    @ManyToMany(mappedBy = "producers")
    private Set<Product> products = new HashSet<>();

    public Producer(String name, String elevation, String tags, Set<Region> regions, Set<Country> countries) {
        this.name = name;
        this.elevation = elevation;
        this.tags = tags;
        this.regions = regions;
        this.countries = countries;
    }

    @ManyToMany
    @JoinTable(
            name = "producer_region",
            joinColumns = @JoinColumn(name = "producer_id"),
            inverseJoinColumns = @JoinColumn(name = "region_id")
    )
    private Set<Region> regions = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "producer_country",
            joinColumns = @JoinColumn(name = "producer_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id")
    )
    private Set<Country> countries = new HashSet<>();
}
