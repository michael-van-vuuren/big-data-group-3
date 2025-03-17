//package com.Backend.Backend.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Getter
//@Setter
//@Entity
//@Table(name = "Producer")
//public class Producer {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//
//    @Column(nullable = false)
//    private int elevation;
//
//    @ManyToOne
//    @JoinColumn(name = "region_id", nullable = false)
//    private Region region;
//
//    @ManyToMany(mappedBy = "producers")
//    private Set<Product> products = new HashSet<>();
//
//    public Producer() {
//    }
//
//    public Producer(String name, int elevation) {
//        this.name = name;
//        this.elevation = elevation;
//    }
//}
