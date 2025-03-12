package com.Backend.Backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Process")
public class Process {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String tags;

    @ManyToMany(mappedBy = "processes")
    private Set<Product> products = new HashSet<>();


    public Process() {
    }

    public Process(String name, String tags) {
        this.name = name;
        this.tags = tags;
    }
}
