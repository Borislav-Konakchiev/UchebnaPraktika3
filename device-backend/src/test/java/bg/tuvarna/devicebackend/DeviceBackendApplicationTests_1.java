package bg.tuvarna.devicebackend;

import bg.tuvarna.devicebackend.config.JwtService;
import bg.tuvarna.devicebackend.controllers.execptions.CustomException;
import bg.tuvarna.devicebackend.controllers.execptions.ErrorCode;
import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.models.enums.UserRole;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;

import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class DeviceBackendApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Test
    void contextLoads_shouldStartApplicationContext() {
        assertNotNull(applicationContext);
    }

    @Test
    void jwtService_shouldGenerateTokenAndExtractId() {
        User u = new User();
        u.setId(42L);
        u.setRole(UserRole.USER);

        String token = jwtService.generateToken(u);
        assertNotNull(token);

        String id = jwtService.extractId(token);
        assertEquals("42", id);
    }

    @Test
    void jwtService_shouldValidateToken_whenUserMatches() {
        User u = new User();
        u.setId(7L);
        u.setRole(UserRole.USER);

        String token = jwtService.generateToken(u);
        assertTrue(jwtService.isTokenValid(token, u));
    }

    @Test
    void passwordEncoder_shouldEncodeAndMatchPassword() {
        String encoded = passwordEncoder.encode("Password1");
        assertTrue(passwordEncoder.matches("Password1", encoded));
    }

    @Test
    void jwtServiceExtractId_shouldThrow_whenTokenMalformed() {
        CustomException ex = assertThrows(CustomException.class, () -> jwtService.extractId("not-a-jwt"));
        assertEquals(ErrorCode.Failed, ex.getErrorCode());
    }
    @Test
    void jwtServiceIsTokenExpired_shouldReturnTrue_whenTokenExpired() throws Exception {
        Field keyField = JwtService.class.getDeclaredField("key");
        keyField.setAccessible(true);
        SecretKey key = (SecretKey) keyField.get(jwtService);

        String expiredToken = Jwts.builder()
                .setSubject("1")
                .setIssuedAt(new Date(System.currentTimeMillis() - 60_000))
                .setExpiration(new Date(System.currentTimeMillis() - 1_000))
                .signWith(key)
                .compact();

        assertTrue(jwtService.isTokenExpired(expiredToken));
    }
}
