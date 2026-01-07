package bg.tuvarna.devicebackend.models.dtos;

import java.time.LocalDate;

public record RenovationCreateVO (
    String deviceSerialNumber,
    String description,
    LocalDate renovationDate
) {
}