package com.Backend.Backend.service;

import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.repository.FlavorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FlavorService {
    private final FlavorRepository flavorRepository;

    public FlavorService(FlavorRepository flavorRepository) {
        this.flavorRepository = flavorRepository;
    }

    // Find or create Flavors (many-to-many)
    public Set<Flavor> addOrUpdateFlavors(List<String> flavorNames) {
        if (flavorNames == null) return null;

        return flavorNames.stream()
                .filter(Objects::nonNull)
                .map(name -> flavorRepository.findByName(name)
                        .orElseGet(() -> flavorRepository.save(new Flavor(name))))
                .collect(Collectors.toSet());
    }
}
