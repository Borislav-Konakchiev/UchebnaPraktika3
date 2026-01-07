package bg.tuvarna.devicebackend.models.dtos;

import bg.tuvarna.devicebackend.models.entities.Passport;

public record PassportForSerialNumberVO(
        Long id,
        String name,
        String model
) {
    public PassportForSerialNumberVO(Passport passportBySerialId) {
        this(passportBySerialId.getId(), passportBySerialId.getName(), passportBySerialId.getModel());
    }
}