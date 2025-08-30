package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL;

public class DarkstoreNotFoundException extends DarkstoreSQLException {
    @Override
    public String getMessage() {
        return "Выбранный магазин не найден";
    }
}
