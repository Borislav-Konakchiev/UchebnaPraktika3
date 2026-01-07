package bg.tuvarna.devicebackend.uservices;


import bg.tuvarna.devicebackend.controllers.execptions.CustomException;
import bg.tuvarna.devicebackend.controllers.execptions.ErrorCode;
import bg.tuvarna.devicebackend.models.dtos.ChangePasswordVO;
import bg.tuvarna.devicebackend.models.dtos.UserCreateVO;
import bg.tuvarna.devicebackend.models.dtos.UserUpdateVO;
import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.models.enums.UserRole;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import bg.tuvarna.devicebackend.services.DeviceService;
import bg.tuvarna.devicebackend.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServicesTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DeviceService deviceService;

    @InjectMocks
    private UserService userService;

    private UserCreateVO validCreateVO;

    @BeforeEach
    void setUp() {
        validCreateVO = new UserCreateVO(
                "Test User",
                "Password1",
                "test.user@mail.com",
                "0888123456",
                "Varna",
                LocalDate.of(2025, 1, 10),
                "ABC100"
        );
    }

    @Test
    void register_shouldThrowAlreadyExists_whenEmailTaken() {
        when(userRepository.getByEmail(validCreateVO.email())).thenReturn(new User());

        CustomException ex = assertThrows(CustomException.class, () -> userService.register(validCreateVO));
        assertEquals(ErrorCode.AlreadyExists, ex.getErrorCode());

        verify(userRepository, never()).save(any(User.class));
        verify(deviceService, never()).registerDevice(anyString(), any(), any());
    }

    @Test
    void register_shouldThrowAlreadyExists_whenPhoneTaken() {
        when(userRepository.getByEmail(validCreateVO.email())).thenReturn(null);
        when(userRepository.getByPhone(validCreateVO.phone())).thenReturn(new User());

        CustomException ex = assertThrows(CustomException.class, () -> userService.register(validCreateVO));
        assertEquals(ErrorCode.AlreadyExists, ex.getErrorCode());

        verify(userRepository, never()).save(any(User.class));
        verify(deviceService, never()).registerDevice(anyString(), any(), any());
    }

    @Test
    void register_shouldSaveUserAndRegisterDevice_whenValid() {
        when(userRepository.getByEmail(validCreateVO.email())).thenReturn(null);
        when(userRepository.getByPhone(validCreateVO.phone())).thenReturn(null);
        when(passwordEncoder.encode(validCreateVO.password())).thenReturn("ENC");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0, User.class);
            u.setId(123L);
            return u;
        });

        doNothing().when(deviceService).alreadyExist(validCreateVO.deviceSerialNumber());
        doNothing().when(deviceService).registerDevice(eq(validCreateVO.deviceSerialNumber()), eq(validCreateVO.purchaseDate()), any(User.class));

        assertDoesNotThrow(() -> userService.register(validCreateVO));

        verify(userRepository, times(1)).save(any(User.class));
        verify(deviceService, times(1)).alreadyExist(validCreateVO.deviceSerialNumber());
        verify(deviceService, times(1)).registerDevice(eq(validCreateVO.deviceSerialNumber()), eq(validCreateVO.purchaseDate()), any(User.class));
    }

    @Test
    void updateUser_shouldThrowValidation_whenAdmin() {
        User admin = new User();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);
        admin.setEmail("admin@mail.com");
        admin.setPhone("000");

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        UserUpdateVO updateVO = new UserUpdateVO(1L, "New", "Addr", "0888000000", "new@mail.com");

        CustomException ex = assertThrows(CustomException.class, () -> userService.updateUser(updateVO));
        assertEquals(ErrorCode.Validation, ex.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updatePassword_shouldSaveNewPassword_whenOldMatches() {
        User u = new User();
        u.setId(2L);
        u.setRole(UserRole.USER);
        u.setPassword("HASHED");

        when(userRepository.findById(2L)).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("OldPass1", "HASHED")).thenReturn(true);
        when(passwordEncoder.encode("NewPass1")).thenReturn("NEW_HASH");

        assertDoesNotThrow(() -> userService.updatePassword(2L, new ChangePasswordVO("OldPass1", "NewPass1")));

        verify(userRepository, times(1)).save(argThat(saved -> "NEW_HASH".equals(saved.getPassword())));
    }
}
