package bg.tuvarna.devicebackend.models.dtos;

import bg.tuvarna.devicebackend.annotations.ValidEmail;
import bg.tuvarna.devicebackend.annotations.ValidPassword;

import java.time.LocalDate;

public record UserCreateVO(
        String fullName,
        @ValidPassword
        String password,
        @ValidEmail
        String email,
        String phone,
        String address,
        LocalDate purchaseDate,
        String deviceSerialNumber
) {
}