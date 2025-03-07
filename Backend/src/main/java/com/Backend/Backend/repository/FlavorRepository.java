package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Flavor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlavorRepository extends JpaRepository<Flavor, Integer> {
    Flavor findByName(String name);
}
