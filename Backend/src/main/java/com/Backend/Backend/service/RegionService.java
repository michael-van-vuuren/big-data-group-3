package com.Backend.Backend.service;

import com.Backend.Backend.entity.Region;
import com.Backend.Backend.repository.RegionRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RegionService {
    private final RegionRepository regionRepository;

    public RegionService(RegionRepository regionRepository) {
        this.regionRepository = regionRepository;
    }

    public Set<Region> addOrUpdateRegions(List<String> regionNames) {
        if (regionNames == null) return Collections.emptySet();

        return regionNames.stream()
                .filter(Objects::nonNull)
                .map(name -> regionRepository.findByName(name)
                        .orElseGet(() -> regionRepository.save(new Region(name, new HashSet<>()))))
                .collect(Collectors.toSet());
    }
}

