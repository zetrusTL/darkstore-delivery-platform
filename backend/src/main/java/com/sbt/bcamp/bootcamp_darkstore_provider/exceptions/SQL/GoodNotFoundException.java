package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL;

public class GoodNotFoundException extends DarkstoreSQLException{
    @Override
    public String getMessage() {
        return "Выбранный товар не существует.";
    }
}
