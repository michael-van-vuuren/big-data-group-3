package com.Backend.Backend.service;

import com.Backend.Backend.dto.*;
import com.Backend.Backend.entity.*;
import com.Backend.Backend.entity.Process;
import com.Backend.Backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final RoasterRepository roasterRepository;
    private final ProcessRepository processRepository;
    private final FlavorRepository flavorRepository;
    private final ProducerRepository producerRepository;
    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;

    public ProductService(
            ProductRepository productRepository,
            RoasterRepository roasterRepository,
            ProcessRepository processRepository,
            FlavorRepository flavorRepository,
            ProducerRepository producerRepository,
            CountryRepository countryRepository,
            RegionRepository regionRepository
    ) {
        this.productRepository = productRepository;
        this.roasterRepository = roasterRepository;
        this.processRepository = processRepository;
        this.flavorRepository = flavorRepository;
        this.producerRepository = producerRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
    }

    // Get country or create if it doesn't exist
    private Country getOrCreateCountry(CountryDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        return countryRepository.findByName(dto.getName())
                .orElseGet(() -> countryRepository.save(new Country(dto.getName())));
    }

    // Get roaster or create if it doesn't exist
    private Roaster getOrCreateRoaster(RoasterDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        Country country = getOrCreateCountry(dto.getCountry());

        return roasterRepository.findByName(dto.getName())
                .orElseGet(() -> roasterRepository.save(new Roaster(dto.getName(), country)));
    }

    // Get process or create if it doesn't exist
    private Process getOrCreateProcess(ProcessDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        return processRepository.findByName(dto.getName())
                .orElseGet(() -> processRepository.save(new Process(dto.getName(), dto.getTag())));
    }

    // Get flavor or create if it doesn't exist
    private Flavor getOrCreateFlavor(FlavorDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        return flavorRepository.findByName(dto.getName())
                .orElseGet(() -> flavorRepository.save(new Flavor(dto.getName())));
    }

    // Get region or create if it doesn't exist
    private Region getOrCreateRegion(RegionDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        return regionRepository.findByName(dto.getName())
                .orElseGet(() -> regionRepository.save(new Region(dto.getName())));
    }

    // Get producer or create if it doesn't exist
    private Producer getOrCreateProducer(ProducerDTO dto) {
        if (dto == null || dto.getName() == null) return null;

        Producer producer = producerRepository.findByName(dto.getName())
                .orElseGet(() -> {
                    Producer newProducer = new Producer(
                            dto.getName(),
                            dto.getElevation(),
                            dto.getTag()
                    );
                    return producerRepository.save(newProducer);
                });

        // Process regions
        if (dto.getRegions() != null) {
            for (RegionDTO regionDto : dto.getRegions()) {
                Region region = getOrCreateRegion(regionDto);
                if (region != null) {
                    producer.getRegions().add(region);
                    region.getProducers().add(producer);
                }
            }
        }

        // Process countries
        if (dto.getCountries() != null) {
            for (CountryDTO countryDto : dto.getCountries()) {
                Country country = getOrCreateCountry(countryDto);
                if (country != null) {
                    producer.getCountries().add(country);
                    country.getProducers().add(producer);
                }
            }
        }

        return producerRepository.save(producer);
    }

    // Safely process a list
    private <T> List<T> safeList(List<T> list) {
        return list != null ? list : Collections.emptyList();
    }

    @Transactional
    public void importProducts(List<ProductDTO> products) {
        for (ProductDTO dto : safeList(products)) {
            // Create Product
            Product product = new Product();
            product.setName(dto.getName());
            product.setBeanId(dto.getBeanId());
            product.setRoaster(getOrCreateRoaster(dto.getRoaster()));
            product.setProcess(getOrCreateProcess(dto.getProcess()));
            product.setImage(dto.getImage());
            product.setWebpage(dto.getWebpage());
            product.setGram(dto.getGram());
            product.setRoastDegree(dto.getRoastDegree());
            product.setAvailability("YES".equalsIgnoreCase(dto.getAvailability()) ?
                    Product.Availability.YES : Product.Availability.NO);
            product.setPrice(dto.getPrice());
            product.setPricePerCup(dto.getPricePerCup());
            product.setBulkPricePerCup(dto.getBulkPricePerCup());

            // Save product first to establish ID
            product = productRepository.save(product);

            // Handle Flavors
            for (FlavorDTO flavorDto : safeList(dto.getFlavors())) {
                Flavor flavor = getOrCreateFlavor(flavorDto);
                if (flavor != null) {
                    product.getFlavors().add(flavor);
                    flavor.getProducts().add(product);
                }
            }

            // Handle Producers
            for (ProducerDTO producerDto : safeList(dto.getProducers())) {
                Producer producer = getOrCreateProducer(producerDto);
                if (producer != null) {
                    product.getProducers().add(producer);
                    producer.getProducts().add(product);
                }
            }

            // Save product with all relationships
            productRepository.save(product);
        }
    }
}