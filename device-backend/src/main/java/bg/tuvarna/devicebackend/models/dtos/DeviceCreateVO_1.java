package bg.tuvarna.devicebackend.models.dtos;

import java.time.LocalDate;

public record DeviceCreateVO(
        String deviceSerialNumber,
        LocalDate purchaseDate,
        Long userId
) {
}