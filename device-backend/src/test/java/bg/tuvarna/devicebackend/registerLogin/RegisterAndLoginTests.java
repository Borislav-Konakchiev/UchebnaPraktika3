package bg.tuvarna.devicebackend.registerLogin;

import bg.tuvarna.devicebackend.models.entities.Passport;
import bg.tuvarna.devicebackend.repositories.DeviceRepository;
import bg.tuvarna.devicebackend.repositories.PassportRepository;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class RegisterAndLoginTests {

    @Autowired
    private TestRestTemplate rest;

    @Autowired
    private PassportRepository passportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        deviceRepository.deleteAll();
        userRepository.deleteAll();
        passportRepository.deleteAll();

        passportRepository.save(Passport.builder()
                .name("TestPassport")
                .model("M1")
                .serialPrefix("ABC")
                .fromSerialNumber(1)
                .toSerialNumber(9999)
                .warrantyMonths(24)
                .build());
    }

    @Test
    void userRegistrationSuccess_shouldReturnOk() {
        ResponseEntity<Void> res = rest.postForEntity(
                "/api/v1/users/registration",
                jsonEntity(Map.of(
                        "fullName", "Test User",
                        "password", "Password1",
                        "email", "test.user@mail.com",
                        "phone", "0888123456",
                        "address", "Varna",
                        "purchaseDate", LocalDate.of(2025, 1, 10).toString(),
                        "deviceSerialNumber", "ABC100"
                )),
                Void.class
        );

        assertEquals(HttpStatus.OK, res.getStatusCode());
        assertNotNull(userRepository.getByEmail("test.user@mail.com"));
        assertTrue(deviceRepository.existsById("ABC100"));
    }

    @Test
    void userRegistrationFailed_shouldReturnBadRequest_whenDuplicateEmail() {
        registerDefaultUser();

        ResponseEntity<String> res = rest.postForEntity(
                "/api/v1/users/registration",
                jsonEntity(Map.of(
                        "fullName", "Test User 2",
                        "password", "Password1",
                        "email", "test.user@mail.com", // duplicate
                        "phone", "0888999999",
                        "address", "Varna",
                        "purchaseDate", LocalDate.of(2025, 1, 10).toString(),
                        "deviceSerialNumber", "ABC101"
                )),
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
        assertNotNull(res.getBody());
        assertTrue(res.getBody().contains("\"errorCode\":1")); // AlreadyExists = 1
    }

    @Test
    void userLoginSuccess_shouldReturnTokenAndUser() throws Exception {
        registerDefaultUser();

        ResponseEntity<String> res = rest.postForEntity(
                "/api/v1/users/login",
                jsonEntity(Map.of(
                        "username", "test.user@mail.com",
                        "password", "Password1"
                )),
                String.class
        );

        assertEquals(HttpStatus.OK, res.getStatusCode());
        JsonNode json = objectMapper.readTree(res.getBody());

        assertTrue(json.hasNonNull("token"));
        assertTrue(json.hasNonNull("user"));
        assertEquals("test.user@mail.com", json.get("user").get("email").asText());
    }

    @Test
    void userLoginFailed_shouldThrowResourceAccessException_whenWrongPassword() {
        registerDefaultUser();

        assertThrows(ResourceAccessException.class, () ->
                rest.postForEntity(
                        "/api/v1/users/login",
                        jsonEntity(Map.of(
                                "username", "test.user@mail.com",
                                "password", "WrongPass1"
                        )),
                        String.class
                )
        );
    }

    @Test
    void accessProtectedEndpointWithoutToken_shouldReturnUnauthorized() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("userId", "1");

        HttpEntity<String> req = new HttpEntity<>(
                toJson(Map.of("oldPassword", "Password1", "newPassword", "NewPass1")),
                headers
        );

        ResponseEntity<String> res = rest.exchange(
                "/api/v1/users/changePassword",
                HttpMethod.PUT,
                req,
                String.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
    }
    @Test
    void accessProtectedEndpointWithToken_shouldReturnOk() throws Exception {
        registerDefaultUser();

      
        ResponseEntity<String> loginRes = rest.postForEntity(
                "/api/v1/users/login",
                jsonEntity(Map.of(
                        "username", "test.user@mail.com",
                        "password", "Password1"
                )),
                String.class
        );

        assertEquals(HttpStatus.OK, loginRes.getStatusCode());
        assertNotNull(loginRes.getBody());

        JsonNode json = objectMapper.readTree(loginRes.getBody());
        String token = json.get("token").asText();
        long userId = json.get("user").get("id").asLong();

        assertNotNull(token);
        assertTrue(token.length() > 10);


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        headers.add("userId", String.valueOf(userId));

        HttpEntity<String> req = new HttpEntity<>(
                toJson(Map.of(
                        "oldPassword", "Password1",
                        "newPassword", "NewPass1A"
                )),
                headers
        );

        ResponseEntity<String> res = rest.exchange(
                "/api/v1/users/changePassword",
                HttpMethod.PUT,
                req,
                String.class
        );

        assertEquals(HttpStatus.OK, res.getStatusCode());
    }

    private void registerDefaultUser() {
        ResponseEntity<Void> res = rest.postForEntity(
                "/api/v1/users/registration",
                jsonEntity(Map.of(
                        "fullName", "Test User",
                        "password", "Password1",
                        "email", "test.user@mail.com",
                        "phone", "0888123456",
                        "address", "Varna",
                        "purchaseDate", LocalDate.of(2025, 1, 10).toString(),
                        "deviceSerialNumber", "ABC100"
                )),
                Void.class
        );

        assertEquals(HttpStatus.OK, res.getStatusCode());
    }

    private HttpEntity<String> jsonEntity(Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(toJson(body), headers);
    }

    private String toJson(Map<String, Object> body) {
        try {
            return objectMapper.writeValueAsString(body);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
