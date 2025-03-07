package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Flavor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FlavorRepository extends JpaRepository<Flavor, Integer> {
    Optional<Flavor> findByName(String name);
}
