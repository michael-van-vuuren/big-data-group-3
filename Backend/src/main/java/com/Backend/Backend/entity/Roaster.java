package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roaster")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Roaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @OneToMany(mappedBy = "roaster", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();

    public Roaster(String name, Country country) {
        this.name = name;
        this.country = country;
    }
}
