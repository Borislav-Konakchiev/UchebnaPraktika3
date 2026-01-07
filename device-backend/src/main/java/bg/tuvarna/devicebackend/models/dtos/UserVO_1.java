package bg.tuvarna.devicebackend.models.dtos;

import bg.tuvarna.devicebackend.models.entities.Device;
import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.models.enums.UserRole;

import java.util.List;

public record UserVO(
        Long id,
        String fullName,
        String address,
        String phone,
        String email,
        UserRole role,
        List<Device> devices
) {
    public UserVO(User user){
        this(user.getId(), user.getFullName(), user.getAddress(), user.getPhone(), user.getEmail(), user.getRole(), user.getDevices());
    }
}