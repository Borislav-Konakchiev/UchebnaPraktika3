package bg.tuvarna.devicebackend.models.dtos;

import java.time.LocalDate;

public record DeviceUpdateVO(
        String serialNumber,
        LocalDate purchaseDate,
        String comment
) {
}