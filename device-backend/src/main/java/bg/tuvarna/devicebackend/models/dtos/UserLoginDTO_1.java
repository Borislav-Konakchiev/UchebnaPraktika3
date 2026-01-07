package bg.tuvarna.devicebackend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    private String username;
    private String password;
}