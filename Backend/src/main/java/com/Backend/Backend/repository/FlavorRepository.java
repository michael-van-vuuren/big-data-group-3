package com.Backend.Backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import com.Backend.Backend.dto.FlavorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import com.Backend.Backend.entity.Flavor;

@Repository
public interface FlavorRepository extends JpaRepository<Flavor, Long> {
    Optional<Flavor> findByName(String name);

    List<Flavor> findAllByNameIn(Collection<String> names);

    @Query("SELECT new com.Backend.Backend.dto.FlavorDTO(f.name) FROM Flavor f")
    List<FlavorDTO> findAllFlavorsAsDTO();
}

