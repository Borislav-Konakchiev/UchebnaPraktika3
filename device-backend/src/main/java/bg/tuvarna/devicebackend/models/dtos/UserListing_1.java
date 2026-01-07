package bg.tuvarna.devicebackend.models.dtos;

import bg.tuvarna.devicebackend.models.entities.Device;
import bg.tuvarna.devicebackend.models.entities.User;

import java.util.List;

public record UserListing(
        Long id,
        String fullName,
        String address,
        String phone,
        String email,
        List<Device> devices
) {
    public UserListing (User user){
        this(user.getId(), user.getFullName(), user.getAddress(), user.getPhone(), user.getEmail(), user.getDevices());
    }
}