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

    @OneToMany(mappedBy = "roaster", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}
