package com.Backend.Backend.DTOTests;
import com.Backend.Backend.dto.*;
import com.Backend.Backend.entity.*;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

class AllDtoTests {

    @Nested
    class AuthResponseTests {
        @Test
        void allArgsConstructorAndGetters() {
            AuthResponse resp = new AuthResponse("Alice", "alice@example.com", "USER");
            assertEquals("Alice", resp.getName());
            assertEquals("alice@example.com", resp.getEmail());
            assertEquals("USER", resp.getRole());
        }

        @Test
        void fromRoleConstructor() {
            AuthResponse resp = new AuthResponse("Bob", "bob@example.com", Account.Role.BUSINESS);
            assertEquals("Bob", resp.getName());
            assertEquals("bob@example.com", resp.getEmail());
            assertEquals("BUSINESS", resp.getRole());
        }
    }

    @Nested
    class CountryDTOTests {
        @Test
        void fromEntity_null() {
            assertNull(CountryDTO.fromEntity(null));
        }

        @Test
        void fromEntity_valid() {
            Country country = new Country("Brazil");
            CountryDTO dto = CountryDTO.fromEntity(country);
            assertEquals("Brazil", dto.getName());
        }
    }

    @Nested
    class FlavorDTOTests {
        @Test
        void fromEntity_null() {
            assertNull(FlavorDTO.fromEntity(null));
        }

        @Test
        void fromEntity_valid() {
            Flavor flavor = new Flavor("Chocolate");
            FlavorDTO dto = FlavorDTO.fromEntity(flavor);
            assertEquals("Chocolate", dto.getName());
        }
    }

    @Nested
    class ProcessDTOTests {
        @Test
        void fromEntity_null() {
            assertNull(ProcessDTO.fromEntity(null));
        }

        @Nested
        class ProducerDTOTests {
            @Test
            void fromEntity_null() {
                assertNull(ProducerDTO.fromEntity(null));
            }

            @Test
            void fromEntity_valid() {
                Region region = new Region("Highlands");
                Country country = new Country("Kenya");
                Producer prod = new Producer(
                        "FarmCo",
                        "1500m",
                        "organic",
                        Set.of(region),
                        Set.of(country)
                );
                ProducerDTO dto = ProducerDTO.fromEntity(prod);
                assertEquals("FarmCo", dto.getName());
                assertEquals("organic", dto.getTag());
                assertEquals("1500m", dto.getElevation());
                assertNotNull(dto.getRegions());
                assertEquals(1, dto.getRegions().size());
                assertEquals("Highlands", dto.getRegions().getFirst().getName());
                assertNotNull(dto.getCountries());
                assertEquals(1, dto.getCountries().size());
                assertEquals("Kenya", dto.getCountries().getFirst().getName());
            }
        }

        @Nested
        class ProductImportDTOTests {
            @Test
            void fromProduct_null() {
                assertNull(ProductImportDTO.fromProduct(null));
            }

            @Test
            void fromProduct_valid() {
                Product product = new Product();
                product.setId(99L);
                product.setName("Espresso");
                ProductImportDTO dto = ProductImportDTO.fromProduct(product);
                assertEquals(99L, dto.getId());
                assertEquals("Espresso", dto.getName());
            }

            @Test
            void fromProductDTO_null() {
                assertNull(ProductImportDTO.fromProductDTO(null));
            }

            @Test
            void fromProductDTO_valid() {
                ProductDTO pdto = new ProductDTO();
                pdto.setName("Latte");
                ProductImportDTO dto = ProductImportDTO.fromProductDTO(pdto);
                assertNull(dto.getId());
                assertEquals("Latte", dto.getName());
            }
        }

        @Nested
        class FavoriteRequestTests {
            @Test
            void gettersAndSetters() {
                FavoriteRequest req = new FavoriteRequest();
                req.setProductId(123L);
                assertEquals(123L, req.getProductId());
            }
        }

        @Nested
        class LoginRequestTests {
            @Test
            void gettersAndSetters() {
                LoginRequest req = new LoginRequest();
                req.setEmail("user@ex.com");
                req.setPassword("pwd");
                assertEquals("user@ex.com", req.getEmail());
                assertEquals("pwd", req.getPassword());
            }
        }

        @Nested
        class MessageResponseTests {
            @Test
            void allArgsAndGetters() {
                MessageResponse msg = new MessageResponse("Hello");
                assertEquals("Hello", msg.getMessage());
            }

            @Test
            void noArgsAndSetter() {
                MessageResponse msg = new MessageResponse();
                msg.setMessage("World");
                assertEquals("World", msg.getMessage());
            }
        }

        @Nested
        class ProductDTOTests {
            @Test
            void gettersAndSetters() {
                ProductDTO dto = new ProductDTO();
                dto.setBeanId(7L);
                dto.setName("Mocha");
                dto.setImage("img.png");
                dto.setWebpage("http://coffee");
                dto.setGram(BigDecimal.valueOf(250));
                dto.setRoastDegree("Medium");
                dto.setAvailability("YES");
                dto.setPrice(BigDecimal.valueOf(12.34));
                dto.setPricePerCup(BigDecimal.valueOf(1.23));
                dto.setBulkPricePerCup(BigDecimal.valueOf(0.99));
                dto.setRoaster(new RoasterDTO("BestRoast", new CountryDTO("Test Country")));
                dto.setProcess(new ProcessDTO("Washed", "bright"));
                dto.setFlavors(List.of(new FlavorDTO("Nutty")));
                dto.setProducers(List.of(new ProducerDTO("Farm", "tag", "elev", List.of(), List.of())));

                assertEquals(7L, dto.getBeanId());
                assertEquals("Mocha", dto.getName());
                assertEquals("img.png", dto.getImage());
                assertEquals("http://coffee", dto.getWebpage());
                assertEquals(BigDecimal.valueOf(250), dto.getGram());
                assertEquals("Medium", dto.getRoastDegree());
                assertEquals("YES", dto.getAvailability());
                assertEquals(BigDecimal.valueOf(12.34), dto.getPrice());
                assertEquals(BigDecimal.valueOf(1.23), dto.getPricePerCup());
                assertEquals(BigDecimal.valueOf(0.99), dto.getBulkPricePerCup());
                assertEquals("BestRoast", dto.getRoaster().getName());
                assertEquals("Washed", dto.getProcess().getName());
                assertEquals("Nutty", dto.getFlavors().getFirst().getName());
                assertEquals("Farm", dto.getProducers().getFirst().getName());
            }
        }
    }
}
