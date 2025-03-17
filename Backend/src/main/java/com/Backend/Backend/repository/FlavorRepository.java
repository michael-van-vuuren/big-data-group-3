package com.Backend.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Backend.Backend.entity.Flavor;

@Repository
public interface FlavorRepository extends JpaRepository<Flavor, Long> {
    Optional<Flavor> findByName(String name);
}

