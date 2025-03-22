package com.Backend.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "process")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Process {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 1000)
    private String tags;

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();

    public Process(String name, String tags) {
        this.name = name;
        this.tags = tags;
    }
}
