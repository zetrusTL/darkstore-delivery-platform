package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL;

public class DeliveryNotFoundException extends DarkstoreSQLException {
    @Override
    public String getMessage() {
        return "Выбранного заказа не существует";
    }
}
