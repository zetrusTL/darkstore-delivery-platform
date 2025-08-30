package com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.handlers;

import com.sbt.bcamp.bootcamp_darkstore_provider.exceptions.SQL.*;
import org.postgresql.util.PSQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class DarkstoreExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(RecordNotFoundException.class)
    protected ResponseEntity<String> handleRecordNotFoundException(RecordNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(RecordAlreadyExistException.class)
    protected ResponseEntity<String> handleRecordAlreadyExistException(RecordAlreadyExistException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(DarkstoreNotFoundException.class)
    protected ResponseEntity<String> handleDarkstoreNotFoundException(DarkstoreNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(DeliveryNotFoundException.class)
    protected ResponseEntity<String> handleDeliveryNotFoundException(DeliveryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(GoodNotFoundException.class)
    protected ResponseEntity<String> handleGoodNotFoundException(GoodNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
    @ExceptionHandler({PSQLException.class})
    protected ResponseEntity<String> handlePSQLException(PSQLException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
