package bg.tuvarna.devicebackend.controllers;

import bg.tuvarna.devicebackend.models.dtos.PassportForSerialNumberVO;
import bg.tuvarna.devicebackend.models.dtos.PassportVO;
import bg.tuvarna.devicebackend.models.entities.Passport;
import bg.tuvarna.devicebackend.services.PassportService;
import bg.tuvarna.devicebackend.utils.CustomPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/passports")
@AllArgsConstructor
public class PassportController {
    private final PassportService passportService;

    @Operation(description = "Create/update passport",
            summary = "Create/update passport")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful saved passport")
    })
    @PostMapping(value = "/save")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> save(@RequestBody PassportVO passportVO) {
        passportService.save(passportVO);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Get passports",
            summary = "Get passports")
    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CustomPage<Passport>> getPassports(@RequestParam(defaultValue = "1") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(passportService.getPassports(page, size));
    }

    @Operation(description = "delete passport",
            summary = "delete passport")
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deletePassport(@PathVariable Long id) {
        passportService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Get passport by serialId",
            summary = "Get passport by serialId")
    @GetMapping("/getBySerialId/{serialId}")
    public ResponseEntity<PassportForSerialNumberVO> getPassportForSerialId(@PathVariable String serialId) {
        return ResponseEntity.ok(new PassportForSerialNumberVO(passportService.findPassportBySerialId(serialId)));
    }
}