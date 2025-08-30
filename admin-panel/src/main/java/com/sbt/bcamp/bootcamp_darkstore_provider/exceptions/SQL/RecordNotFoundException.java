package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL;

public class RecordNotFoundException extends DarkstoreSQLException {
    @Override
    public String getMessage() {
        return "Запись не найдена.";
    }
}
