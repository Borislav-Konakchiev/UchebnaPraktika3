package bg.tuvarna.devicebackend.config;

import bg.tuvarna.devicebackend.models.enums.UserRole;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final ApplicationConfig applicationConfig;
    private final AuthenticationFilter authenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(SecurityConfig::getCorsConfiguration));
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/api/v1/passports/getBySerialId/*", "/api/v1/users/login", "/api/v1/users/registration", "/swagger-ui", "/swagger", "/swagger-ui/**", "/swagger/**", "/login/**").permitAll();
            auth.requestMatchers("/api/v1/devices/exists/", "/api/v1/devices/addAnonymousDevice", "/api/v1/devices/exists/*").permitAll();
            auth.requestMatchers("/api/v1/users/update", "/api/v1/devices/addDevice", "api/v1/users/getUser", "/api/v1/users/changePassword").hasAnyAuthority(UserRole.USER.toString(), UserRole.ADMIN.toString());
            auth.requestMatchers("/api/v1/passports/**", "/api/v1/users", "/api/v1/users/*", "/api/v1/renovations", "/api/v1/devices", "/api/v1/devices/**").hasAuthority(UserRole.ADMIN.toString());
            auth.anyRequest().authenticated();
        });
        http.authenticationManager(applicationConfig.authenticationManager());
        http.addFilterAt(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.exceptionHandling(e -> e
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
        );

        return http.build();
    }

    private static CorsConfiguration getCorsConfiguration(HttpServletRequest exchange) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowedOriginPatterns(List.of("*"));
        return configuration;
    }
}