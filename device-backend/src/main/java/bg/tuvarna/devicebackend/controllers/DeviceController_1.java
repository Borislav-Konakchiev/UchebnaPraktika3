package bg.tuvarna.devicebackend.controllers;

import bg.tuvarna.devicebackend.controllers.execptions.ErrorResponse;
import bg.tuvarna.devicebackend.models.dtos.DeviceCreateVO;
import bg.tuvarna.devicebackend.models.dtos.DeviceUpdateVO;
import bg.tuvarna.devicebackend.models.entities.Device;
import bg.tuvarna.devicebackend.services.DeviceService;
import bg.tuvarna.devicebackend.utils.CustomPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/devices")
@AllArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;

    @Operation(description = "Return device by id for logged in user.",
            summary = "Return device by id")
    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public Device findDevice(@PathVariable String id) {
        return deviceService.findDevice(id);
    }

    @Operation(description = "Checks if device exists, which means the user is registered.",
            summary = "Checks if device exists")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device is registered."),
            @ApiResponse(responseCode = "400", description = "Device not registered.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))})
    @GetMapping("/exists/{id}")
    public ResponseEntity<Device> isDeviceExists(@PathVariable String id) {
        return ResponseEntity.ok(deviceService.isDeviceExists(id));
    }

    @Operation(description = "Register device for logged in user.",
            summary = "Register device for logged in user")
    @PostMapping("/addDevice")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> addDevice(@RequestBody DeviceCreateVO device) {
        deviceService.registerNewDevice(device);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Returns devices.",
            description = "Returns devices based on search.")
    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CustomPage<Device>> getUsers(@RequestParam(required = false) String searchBy,
                                                       @RequestParam(defaultValue = "1") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(deviceService.getDevices(searchBy, page, size));
    }

    @Operation(description = "Register device for logged in user.",
            summary = "Register device for logged in user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device is registered."),
            @ApiResponse(responseCode = "400", description = "Device already registered.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))})
    @PostMapping("/addAnonymousDevice")
    public ResponseEntity<Void> addAnonymousDevice(@RequestBody DeviceCreateVO device) {
        deviceService.addAnonymousDevice(device);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Update device date by admin.",
            summary = "Update device date by admin.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device is registered."),
            @ApiResponse(responseCode = "400", description = "Device not exist.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))})
    @PutMapping()
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> updateDevice(@RequestBody DeviceUpdateVO device) {
        deviceService.updateDevice(device);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Delete device date by admin.",
            summary = "Delete device date by admin.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device is deleted."),
            @ApiResponse(responseCode = "400", description = "Device has existing renovations.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))})
    @DeleteMapping("/{serialNumber}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteDevice(@PathVariable String serialNumber) {
        deviceService.deleteDevice(serialNumber);
        return ResponseEntity.ok().build();
    }
}