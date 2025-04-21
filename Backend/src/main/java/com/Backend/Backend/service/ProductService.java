package com.Backend.Backend.service;

import com.Backend.Backend.dto.*;
import com.Backend.Backend.entity.*;
import com.Backend.Backend.entity.Process;
import com.Backend.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final RoasterRepository roasterRepository;
    private final ProcessRepository processRepository;
    private final FlavorRepository flavorRepository;
    private final ProducerRepository producerRepository;
    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;

    /* Delete a single product */
    @Transactional
    public boolean deleteProductById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /* Get products by flavors */
    @Transactional(readOnly = true)
    public List<Product> getProductsByFlavors(List<String> flavorNames, boolean strict) {
        if (flavorNames == null || flavorNames.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = strict
                ? productRepository.findProductIdsByAllFlavorNames(flavorNames, flavorNames.size())
                : productRepository.findProductIdsByAnyFlavor(flavorNames);

        if (productIds.isEmpty()) {
            return List.of();
        }

        return productRepository.findProductsWithDetailsByIds(productIds);
    }


    /* Get products by roaster */
    @Transactional(readOnly = true)
    public List<Product> getProductsByRoasterName(String roasterName) {
        if (roasterName == null || roasterName.isBlank()) {
            return List.of();
        }

        List<Long> productIds = productRepository.findProductIdsByRoasterName(roasterName);
        if (productIds.isEmpty()) {
            return List.of();
        }

        return productRepository.findProductsWithDetailsByIds(productIds);
    }


    /* Get products by roaster country */
    @Transactional(readOnly = true)
    public List<Product> getProductsByRoasterCountry(String countryName) {
        if (countryName == null || countryName.isBlank()) {
            return List.of();
        }

        List<Long> productIds = productRepository.findProductIdsByRoasterCountry(countryName);
        if (productIds.isEmpty()) {
            return List.of();
        }

        return productRepository.findProductsWithDetailsByIds(productIds);
    }



    /* Import multiple products
     * This is very long and definitely should be refactored
     * into multiple files (this is how JSON -> SQL tables)
     */
    @Transactional
    public ProductImportResult importProducts(List<ProductDTO> productDTOs) {

        List<ProductImportDTO> acceptedProducts = new ArrayList<>();
        List<ProductImportDTO> rejectedProducts = new ArrayList<>();
        List<String> rejectionReasons = new ArrayList<>();
        Map<String, Set<String>> seenProducts = new HashMap<>();

        // Step 0: Filter out products that already exist (uses composite key Product.name and Product.Roaster.name)
        List<ProductDTO> validProductDTOs = new ArrayList<>();

        productDTOs.forEach(productDTO -> {
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                rejectedProducts.add(ProductImportDTO.fromProductDTO(productDTO));
                rejectionReasons.add("Product name is required");
                return;
            }
            if (productDTO.getRoaster() == null || productDTO.getRoaster().getName() == null || productDTO.getRoaster().getName().trim().isEmpty()) {
                rejectedProducts.add(ProductImportDTO.fromProductDTO(productDTO));
                rejectionReasons.add("Roaster information is required");
                return;
            }
            String roasterName = productDTO.getRoaster().getName();
            String productName = productDTO.getName();

            if (!seenProducts.computeIfAbsent(roasterName, k -> new HashSet<>()).add(productName)) {
                rejectedProducts.add(ProductImportDTO.fromProductDTO(productDTO));
                rejectionReasons.add("Duplicate product in import batch");
                return;
            }
            if (productRepository.compositeKeyExists(roasterName, productName)) {
                rejectedProducts.add(ProductImportDTO.fromProductDTO(productDTO));
                rejectionReasons.add("Product already exists");
                return;
            }
            validProductDTOs.add(productDTO);
        });


        // Step 1: Extract all unique entity names from the DTOs
        Set<String> countryNames = new HashSet<>();
        Set<String> roasterNames = new HashSet<>();
        Set<String> processNames = new HashSet<>();
        Set<String> flavorNames = new HashSet<>();
        Set<String> producerNames = new HashSet<>();
        Set<String> regionNames = new HashSet<>();

        for (ProductDTO dto : validProductDTOs) {
            // Extract country names
            if (dto.getRoaster() != null && dto.getRoaster().getCountry() != null) {
                countryNames.add(dto.getRoaster().getCountry().getName());
            }

            // Extract roaster names
            if (dto.getRoaster() != null) {
                roasterNames.add(dto.getRoaster().getName());
            }

            // Extract process names
            if (dto.getProcess() != null) {
                processNames.add(dto.getProcess().getName());
            }

            // Extract flavor names
            if (dto.getFlavors() != null) {
                dto.getFlavors().stream()
                        .filter(Objects::nonNull)
                        .map(FlavorDTO::getName)
                        .filter(Objects::nonNull)
                        .forEach(flavorNames::add);
            }

            // Extract producer, region, and country names from producers
            if (dto.getProducers() != null) {
                for (ProducerDTO producerDTO : dto.getProducers()) {
                    if (producerDTO != null) {
                        if (producerDTO.getName() != null) {
                            producerNames.add(producerDTO.getName());
                        }

                        // Regions
                        if (producerDTO.getRegions() != null) {
                            producerDTO.getRegions().stream()
                                    .filter(Objects::nonNull)
                                    .map(RegionDTO::getName)
                                    .filter(Objects::nonNull)
                                    .forEach(regionNames::add);
                        }

                        // Countries
                        if (producerDTO.getCountries() != null) {
                            producerDTO.getCountries().stream()
                                    .filter(Objects::nonNull)
                                    .map(CountryDTO::getName)
                                    .filter(Objects::nonNull)
                                    .forEach(countryNames::add);
                        }
                    }
                }
            }
        }


        // Step 2: Batch load all existing entities from the database
        Map<String, Country> existingCountries = fetchAllByName(countryNames, countryRepository::findAllByNameIn);
        Map<String, Roaster> existingRoasters = fetchAllByName(roasterNames, roasterRepository::findAllByNameIn);
        Map<String, Process> existingProcesses = fetchAllByName(processNames, processRepository::findAllByNameIn);
        Map<String, Flavor> existingFlavors = fetchAllByName(flavorNames, flavorRepository::findAllByNameIn);
        Map<String, Producer> existingProducers = fetchAllByName(producerNames, producerRepository::findAllByNameIn);
        Map<String, Region> existingRegions = fetchAllByName(regionNames, regionRepository::findAllByNameIn);


        // Step 3: Create new entities that don't exist yet
        List<Country> newCountries = createMissingEntities(countryNames, existingCountries.keySet(),
                Country::new);
        existingCountries.putAll(saveAndIndex(newCountries, Country::getName));

        // Create processes
        List<Process> newProcesses = createMissingEntities(processNames, existingProcesses.keySet(),
                name -> {
                    ProcessDTO matchedDTO = validProductDTOs.stream()
                            .filter(p -> p.getProcess() != null && name.equals(p.getProcess().getName()))
                            .map(ProductDTO::getProcess)
                            .findFirst()
                            .orElse(null);
                    return new Process(name, matchedDTO != null ? matchedDTO.getTag() : null);
                });
        existingProcesses.putAll(saveAndIndex(newProcesses, Process::getName));

        // Create roasters
        List<Roaster> newRoasters = createMissingEntities(roasterNames, existingRoasters.keySet(),
                name -> {
                    RoasterDTO matchedDTO = validProductDTOs.stream()
                            .filter(p -> p.getRoaster() != null && name.equals(p.getRoaster().getName()))
                            .map(ProductDTO::getRoaster)
                            .findFirst()
                            .orElse(null);

                    Country country = null;
                    if (matchedDTO != null && matchedDTO.getCountry() != null) {
                        country = existingCountries.get(matchedDTO.getCountry().getName());
                    }

                    return new Roaster(name, country);
                });
        existingRoasters.putAll(saveAndIndex(newRoasters, Roaster::getName));

        // Create flavors
        List<Flavor> newFlavors = createMissingEntities(flavorNames, existingFlavors.keySet(),
                Flavor::new);
        existingFlavors.putAll(saveAndIndex(newFlavors, Flavor::getName));

        // Create regions
        List<Region> newRegions = createMissingEntities(regionNames, existingRegions.keySet(),
                Region::new);
        existingRegions.putAll(saveAndIndex(newRegions, Region::getName));

        // Create producers
        List<Producer> newProducers = createMissingEntities(producerNames, existingProducers.keySet(),
                name -> {
                    ProducerDTO matchedDTO = findMatchingProducerDTO(validProductDTOs, name);

                    Producer producer = new Producer(name,
                            matchedDTO != null ? matchedDTO.getElevation() : null,
                            matchedDTO != null ? matchedDTO.getTag() : null);

                    // Set producer regions
                    if (matchedDTO != null && matchedDTO.getRegions() != null) {
                        for (RegionDTO regionDTO : matchedDTO.getRegions()) {
                            if (regionDTO != null && regionDTO.getName() != null) {
                                Region region = existingRegions.get(regionDTO.getName());
                                if (region != null) {
                                    producer.getRegions().add(region);
                                    region.getProducers().add(producer);
                                }
                            }
                        }
                    }

                    // Set producer countries
                    if (matchedDTO != null && matchedDTO.getCountries() != null) {
                        for (CountryDTO countryDTO : matchedDTO.getCountries()) {
                            if (countryDTO != null && countryDTO.getName() != null) {
                                Country country = existingCountries.get(countryDTO.getName());
                                if (country != null) {
                                    producer.getCountries().add(country);
                                    country.getProducers().add(producer);
                                }
                            }
                        }
                    }

                    return producer;
                });
        existingProducers.putAll(saveAndIndex(newProducers, Producer::getName));


        // Step 4: Create and save all products with their relationships
        List<Product> products = new ArrayList<>(validProductDTOs.size());

        for (ProductDTO dto : validProductDTOs) {
            Product product = new Product();
            product.setName(dto.getName());
            product.setBeanId(dto.getBeanId());
            product.setImage(dto.getImage());
            product.setWebpage(dto.getWebpage());
            product.setGram(dto.getGram());
            product.setRoastDegree(dto.getRoastDegree());
            product.setAvailability("YES".equalsIgnoreCase(dto.getAvailability()) ?
                    Product.Availability.YES : Product.Availability.NO);
            product.setPrice(dto.getPrice());
            product.setPricePerCup(dto.getPricePerCup());
            product.setBulkPricePerCup(dto.getBulkPricePerCup());

            // Set roaster
            if (dto.getRoaster() != null) {
                product.setRoaster(existingRoasters.get(dto.getRoaster().getName()));
            }

            // Set process
            if (dto.getProcess() != null) {
                product.setProcess(existingProcesses.get(dto.getProcess().getName()));
            }

            // Add to the batch
            products.add(product);
        }

        // Batch save products without many-to-many relationships
        List<Product> savedProductsNoManyToMany = productRepository.saveAll(products);

        // Many-to-many relationships:
        // Now that products have IDs, these can be created
        for (int i = 0; i < savedProductsNoManyToMany.size(); i++) {
            Product product = savedProductsNoManyToMany.get(i);
            ProductDTO dto = validProductDTOs.get(i);

            // Add flavors
            if (dto.getFlavors() != null) {
                for (FlavorDTO flavorDTO : dto.getFlavors()) {
                    if (flavorDTO != null && flavorDTO.getName() != null) {
                        Flavor flavor = existingFlavors.get(flavorDTO.getName());
                        if (flavor != null) {
                            product.getFlavors().add(flavor);
                            flavor.getProducts().add(product);
                        }
                    }
                }
            }

            // Add producers
            if (dto.getProducers() != null) {
                for (ProducerDTO producerDTO : dto.getProducers()) {
                    if (producerDTO != null && producerDTO.getName() != null) {
                        Producer producer = existingProducers.get(producerDTO.getName());
                        if (producer != null) {
                            product.getProducers().add(producer);
                            producer.getProducts().add(product);
                        }
                    }
                }
            }
        }

        // Batch save products
        List<Product> savedProducts = productRepository.saveAll(savedProductsNoManyToMany);

        for (Product product : savedProducts) {
            acceptedProducts.add(ProductImportDTO.fromProduct(product));
        }

        String message = acceptedProducts.isEmpty() && rejectedProducts.isEmpty() ?
                "No products provided" :
                acceptedProducts.size() + " products accepted, " + rejectedProducts.size() + " rejected";

        return new ProductImportResult(acceptedProducts, rejectedProducts, rejectionReasons, message);
    }






    // Helper functions below (probably will move to a file or something)

    // Find a matching ProducerDTO by name
    private ProducerDTO findMatchingProducerDTO(List<ProductDTO> productDTOs, String producerName) {
        for (ProductDTO dto : productDTOs) {
            if (dto.getProducers() != null) {
                for (ProducerDTO producerDTO : dto.getProducers()) {
                    if (producerDTO != null && producerName.equals(producerDTO.getName())) {
                        return producerDTO;
                    }
                }
            }
        }
        return null;
    }

    // Orchestrate repository fetches and return mapping indexed by name
    private <T> Map<String, T> fetchAllByName(Set<String> names, Function<Collection<String>, List<T>> repositoryMethod) {
        if (names.isEmpty()) return new HashMap<>();

        List<T> entities = repositoryMethod.apply(names);

        return entities.stream()
                .collect(Collectors.toMap(this::getEntityName, Function.identity(), (existing, incoming) -> existing));
    }

    // Use appropriate getName to get name of an entity
    private <T> String getEntityName(T entity) {
        if (entity instanceof Country) return ((Country) entity).getName();
        if (entity instanceof Roaster) return ((Roaster) entity).getName();
        if (entity instanceof Process) return ((Process) entity).getName();
        if (entity instanceof Flavor) return ((Flavor) entity).getName();
        if (entity instanceof Producer) return ((Producer) entity).getName();
        if (entity instanceof Region) return ((Region) entity).getName();
        throw new IllegalArgumentException("Unknown entity type: " + entity.getClass().getName());
    }

    // Create entities that are not in the database yet
    private <T> List<T> createMissingEntities(Set<String> allNames, Set<String> existingNames, Function<String, T> entityCreator) {
        List<T> newEntities = new ArrayList<>();

        for (String name : allNames) {
            if (!existingNames.contains(name)) {
                newEntities.add(entityCreator.apply(name));
            }
        }

        return newEntities;
    }

    // Orchestrate saveAll and return mapping indexed by name
    private <T> Map<String, T> saveAndIndex(List<T> entities, Function<T, String> nameExtractor) {
        if (entities.isEmpty()) return Collections.emptyMap();

        List<T> savedEntities = saveAll(entities);

        return savedEntities.stream()
                .collect(Collectors.toMap(nameExtractor, Function.identity(), (existing, incoming) -> existing));
    }

    // Use appropriate repository to batch save entities (accesses database)
    @SuppressWarnings("unchecked")
    private <T> List<T> saveAll(List<T> entities) {
        if (entities.isEmpty()) return Collections.emptyList();

        Object firstEntity = entities.getFirst();

        if (firstEntity instanceof Country) {
            return (List<T>) countryRepository.saveAll((List<Country>) entities);
        } else if (firstEntity instanceof Roaster) {
            return (List<T>) roasterRepository.saveAll((List<Roaster>) entities);
        } else if (firstEntity instanceof Process) {
            return (List<T>) processRepository.saveAll((List<Process>) entities);
        } else if (firstEntity instanceof Flavor) {
            return (List<T>) flavorRepository.saveAll((List<Flavor>) entities);
        } else if (firstEntity instanceof Producer) {
            return (List<T>) producerRepository.saveAll((List<Producer>) entities);
        } else if (firstEntity instanceof Region) {
            return (List<T>) regionRepository.saveAll((List<Region>) entities);
        } else if (firstEntity instanceof Product) {
            return (List<T>) productRepository.saveAll((List<Product>) entities);
        }

        throw new IllegalArgumentException("Unknown entity type: " + firstEntity.getClass().getName());
    }
}