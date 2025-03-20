package com.Backend.Backend.service;

import com.Backend.Backend.entity.Country;
import com.Backend.Backend.entity.Producer;
import com.Backend.Backend.entity.Region;
import com.Backend.Backend.repository.ProducerRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProducerService {
    private final ProducerRepository producerRepository;
    private final RegionService regionService;
    private final CountryService countryService;

    public ProducerService(ProducerRepository producerRepository, RegionService regionService, CountryService countryService) {
        this.producerRepository = producerRepository;
        this.regionService = regionService;
        this.countryService = countryService;
    }

    public Set<Producer> addOrUpdateProducers(List<String> producer, String elevation, String tags,
                                              List<String> producerRegion, List<String> producerCountry) {
        if (producer == null || producer.isEmpty()) return Collections.emptySet();

        Set<Region> regions = regionService.addOrUpdateRegions(producerRegion);
        Set<Country> countries = countryService.addOrUpdateCountries(producerCountry);

        return producer.stream()
                .filter(Objects::nonNull)
                .map(name -> {
                    Producer existingProducer = producerRepository.findByName(name).orElse(null);

                    if (existingProducer == null) {
                        // Create new producer
                        return producerRepository.save(new Producer(name, elevation, tags, regions, countries));
                    } else {
                        // Update existing producer
                        existingProducer.getRegions().addAll(regions);
                        existingProducer.getCountries().addAll(countries);
                        return producerRepository.save(existingProducer);
                    }
                })
                .collect(Collectors.toSet());
    }
}


