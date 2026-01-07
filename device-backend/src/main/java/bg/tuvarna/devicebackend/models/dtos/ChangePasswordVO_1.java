package bg.tuvarna.devicebackend.models.dtos;

import bg.tuvarna.devicebackend.annotations.ValidPassword;

public record ChangePasswordVO(
        String oldPassword,
        @ValidPassword
        String newPassword
) {
}