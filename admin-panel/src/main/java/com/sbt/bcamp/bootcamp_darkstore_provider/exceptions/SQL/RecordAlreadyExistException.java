package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL;

public class RecordAlreadyExistException extends DarkstoreSQLException{
    @Override
    public String getMessage() {
        return "Запись уже существует.";
    }
}
