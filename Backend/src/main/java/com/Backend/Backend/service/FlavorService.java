package com.Backend.Backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.repository.FlavorRepository;

@Service
public class FlavorService {

    private final FlavorRepository flavorRepository;

    public FlavorService(FlavorRepository flavorRepository) {
        this.flavorRepository = flavorRepository;
    }

    @Transactional
    public void saveFlavors(List<String> flavorNames){
        Set<String> uniqueFlavors = new HashSet<>(flavorNames);

        for (String flavorName : uniqueFlavors) {
            if (flavorRepository.findByName(flavorName).isEmpty()) {
                flavorRepository.save(new Flavor(flavorName));
            }
        }
    }

    public List<Flavor> getAllFlavors(){
        return flavorRepository.findAll();
    }
}
