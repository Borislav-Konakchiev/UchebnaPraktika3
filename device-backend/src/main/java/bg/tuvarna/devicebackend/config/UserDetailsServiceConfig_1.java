package bg.tuvarna.devicebackend.config;

import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceConfig implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        final User profile = userRepository.findById(Long.valueOf(username)).orElse(null);
        if (profile == null) {
            throw new UsernameNotFoundException(username);
        }
        return profile;
    }
}