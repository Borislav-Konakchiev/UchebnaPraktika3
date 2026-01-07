package bg.tuvarna.devicebackend.services;

import bg.tuvarna.devicebackend.controllers.execptions.CustomException;
import bg.tuvarna.devicebackend.controllers.execptions.ErrorCode;
import bg.tuvarna.devicebackend.models.dtos.DeviceCreateVO;
import bg.tuvarna.devicebackend.models.dtos.DeviceUpdateVO;
import bg.tuvarna.devicebackend.models.entities.Device;
import bg.tuvarna.devicebackend.models.entities.Passport;
import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.repositories.DeviceRepository;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import bg.tuvarna.devicebackend.utils.CustomPage;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final PassportService passportService;
    private final UserRepository userRepository;

    public void registerDevice(String serialId, LocalDate purchaseDate, User user) {
        try {
            Passport passport = passportService.findPassportBySerialId(serialId);

            Device device = new Device();
            device.setSerialNumber(serialId);
            device.setPassport(passport);
            device.setUser(user);
            device.setPurchaseDate(purchaseDate);
            device.setWarrantyExpirationDate(purchaseDate.plusMonths(passport.getWarrantyMonths()).plusMonths(12));

            deviceRepository.save(device);
        } catch (RuntimeException e) {
            throw new CustomException("Invalid serial number", ErrorCode.Failed);
        }
    }

    public Device findDevice(String id) {
        return deviceRepository.findById(id).orElse(null);
    }

    public Device isDeviceExists(String id) {
        if (!deviceRepository.existsById(id))
            throw new CustomException("Device not registered", ErrorCode.NotRegistered);
        return findDevice(id);
    }

    public void registerNewDevice(DeviceCreateVO deviceCreateVO) {
        alreadyExist(deviceCreateVO.deviceSerialNumber());
        User user = userRepository.findById(deviceCreateVO.userId()).orElseThrow(() -> new CustomException("User not found", ErrorCode.EntityNotFound));
        registerDevice(deviceCreateVO.deviceSerialNumber(), deviceCreateVO.purchaseDate(), user);
    }

    public void alreadyExist(String serialNumber) {
        if (findDevice(serialNumber) != null)
            throw new CustomException("Device already registered", ErrorCode.AlreadyExists);
    }

    public void updateDevice(DeviceUpdateVO device) {
        Device deviceToUpdate = deviceRepository.findById(device.serialNumber()).orElseThrow(() -> new CustomException("Device not found", ErrorCode.EntityNotFound));
        deviceToUpdate.setPurchaseDate(device.purchaseDate());
        if (deviceToUpdate.getUser() == null)
            deviceToUpdate.setWarrantyExpirationDate(device.purchaseDate().plusMonths(deviceToUpdate.getPassport().getWarrantyMonths()));
        else
            deviceToUpdate.setWarrantyExpirationDate(device.purchaseDate().plusMonths(deviceToUpdate.getPassport().getWarrantyMonths()).plusMonths(12));

        deviceToUpdate.setComment(device.comment());

        deviceRepository.save(deviceToUpdate);
    }

    @Transactional
    public void deleteDevice(String serialNumber) {
        try {
            deviceRepository.deleteBySerialNumber(serialNumber);
        } catch (RuntimeException e) {
            throw new CustomException("Renovations exits", ErrorCode.Failed);
        }
    }

    public void addAnonymousDevice(DeviceCreateVO device) {
        alreadyExist(device.deviceSerialNumber());
        try {
            Passport passport = passportService.findPassportBySerialId(device.deviceSerialNumber());

            Device deviceToAdd = new Device();
            deviceToAdd.setSerialNumber(device.deviceSerialNumber());
            deviceToAdd.setPurchaseDate(device.purchaseDate());
            deviceToAdd.setPassport(passport);
            deviceToAdd.setWarrantyExpirationDate(device.purchaseDate().plusMonths(passport.getWarrantyMonths()));
            deviceRepository.save(deviceToAdd);
        } catch (RuntimeException e) {
            throw new CustomException("Invalid serial number", ErrorCode.Failed);
        }
    }

    public CustomPage<Device> getDevices(String searchBy, int page, int size) {
        Page<Device> devicePage;
        if (searchBy == null) {
            devicePage = deviceRepository.getAllDevices(PageRequest.of(page - 1, size));
        } else {
            devicePage = deviceRepository.findAll(searchBy, PageRequest.of(page - 1, size));
        }

        CustomPage<Device> customPage = new CustomPage<>();
        customPage.setItems(devicePage.getContent());
        customPage.setTotalItems(devicePage.getTotalElements());
        customPage.setTotalPages(devicePage.getTotalPages());
        customPage.setCurrentPage(page);
        customPage.setSize(size);

        return customPage;
    }
}