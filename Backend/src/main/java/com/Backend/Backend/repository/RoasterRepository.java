package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Roaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoasterRepository extends JpaRepository<Roaster, Long> {
    Optional<Roaster> findByName(String name);

    List<Roaster> findAllByNameIn(Collection<String> names);
}

