package com.Backend.Backend.controller;

import com.Backend.Backend.dto.FlavorDTO;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.repository.FlavorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flavors")
public class FlavorController {
    private final FlavorRepository flavorRepository;

    @GetMapping("/all")
    public ResponseEntity<List<FlavorDTO>> getAllFlavors(){
        List<Flavor> flavors = flavorRepository.findAll();

        List<FlavorDTO> dtos = flavors.stream()
                .map(FlavorDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
