package com.Backend.Backend.controller;

import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.service.RoasterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roasters")
public class RoasterController {

    private final RoasterService roasterService;

    public RoasterController(RoasterService roasterService) {
        this.roasterService = roasterService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importRoasters(@RequestBody List<Roaster> roasters) {
        roasterService.saveRoasters(roasters);
        return ResponseEntity.ok("Roasters imported successfully!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Roaster>> getAllRoasters() {
        return ResponseEntity.ok(roasterService.getAllRoasters());
    }
}
