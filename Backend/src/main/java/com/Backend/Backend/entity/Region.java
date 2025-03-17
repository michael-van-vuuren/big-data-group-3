//package com.Backend.Backend.entity;
//
//import jakarta.persistence.*;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Table(name = "Region")
//public class Region {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    // Link to Country
//    @ManyToOne
//    @JoinColumn(name = "country_id", nullable = false)
//    private Country country;
//
//    // One-to-many to Producer
//    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, orphanRemoval = true)
//    private final Set<Producer> producers = new HashSet<>();
//
//    public Region() {
//    }
//
//    public Region(String name, Country country) {
//        this.name = name;
//        this.country = country;
//    }
//}
