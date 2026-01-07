package bg.tuvarna.devicebackend.uapi;

import bg.tuvarna.devicebackend.controllers.UserController;
import bg.tuvarna.devicebackend.controllers.execptions.CustomExceptionHandler;
import bg.tuvarna.devicebackend.services.UserService;
import bg.tuvarna.devicebackend.utils.CustomPage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserApiTests {

    private MockMvc mockMvc;
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);

        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(new UserController(userService))
                .setControllerAdvice(new CustomExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .setValidator(validator)
                .build();
    }

    @Test
    void userRegistration_shouldReturnOk_whenValidBody() throws Exception {
        doNothing().when(userService).register(any());

        Map<String, Object> body = Map.of(
                "fullName", "Test User",
                "password", "Password1",
                "email", "test.user@mail.com",
                "phone", "0888123456",
                "address", "Varna",
                "purchaseDate", LocalDate.of(2025, 1, 10).toString(),
                "deviceSerialNumber", "ABC100"
        );

        mockMvc.perform(post("/api/v1/users/registration")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        verify(userService, times(1)).register(any());
    }

    @Test
    void userRegistration_shouldReturnBadRequest_whenValidationFails() throws Exception {
        Map<String, Object> invalid = Map.of(
                "fullName", "Test User",
                "password", "123",
                "email", "invalid-email",
                "phone", "0888123456",
                "address", "Varna",
                "purchaseDate", LocalDate.of(2025, 1, 10).toString(),
                "deviceSerialNumber", "ABC100"
        );

        mockMvc.perform(post("/api/v1/users/registration")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value(5)); // Validation

        verify(userService, never()).register(any());
    }

    @Test
    void getUsers_shouldReturnOk_whenServiceReturnsPage() throws Exception {
        when(userService.getUsers(any(), anyInt(), anyInt())).thenReturn(new CustomPage<>());

        mockMvc.perform(get("/api/v1/users")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk());

        verify(userService, times(1)).getUsers(isNull(), eq(1), eq(10));
    }

    @Test
    void updateUser_shouldReturnOk_whenValidBody() throws Exception {
        doNothing().when(userService).updateUser(any());

        Map<String, Object> body = Map.of(
                "id", 1,
                "fullName", "Updated",
                "address", "Updated address",
                "phone", "0888999999",
                "email", "updated@mail.com"
        );

        mockMvc.perform(put("/api/v1/users/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        verify(userService, times(1)).updateUser(any());
    }

    @Test
    void changePassword_shouldReturnOk_whenValidBody() throws Exception {
        doNothing().when(userService).updatePassword(anyLong(), any());

        Map<String, Object> body = Map.of(
                "oldPassword", "OldPass1",
                "newPassword", "NewPass1"
        );

        mockMvc.perform(put("/api/v1/users/changePassword")
                        .header("userId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        verify(userService, times(1)).updatePassword(eq(1L), any());
    }
}
