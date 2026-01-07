package bg.tuvarna.devicebackend.models.dtos;

public record PassportVO(
        Long id,
        String name,
        String model,
        String serialPrefix,
        int warrantyMonths,
        int fromSerialNumber,
        int toSerialNumber
) {
}