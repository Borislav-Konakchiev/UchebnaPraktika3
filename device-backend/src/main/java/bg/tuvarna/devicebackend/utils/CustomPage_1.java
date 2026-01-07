package bg.tuvarna.devicebackend.utils;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Setter
@Getter
public class CustomPage<T> {
    private int currentPage;
    private int totalPages;
    private int size;
    private long totalItems;
    private List<T> items;
}