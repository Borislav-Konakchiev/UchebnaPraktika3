package bg.tuvarna.devicebackend;

import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.models.enums.UserRole;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialDataSetup implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initData();
    }

    private void initData() {
        if (userRepository.count() == 0) {
            User user = new User();
            user.setFullName("Admin");
            user.setEmail("admin");
            user.setPassword(passwordEncoder.encode("admin"));
            user.setRole(UserRole.ADMIN);

            userRepository.save(user);
        }
    }
}