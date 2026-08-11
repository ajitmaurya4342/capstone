package com.busgo.exception;
import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.NoSuchElementException;
@RestControllerAdvice
public class GlobalExceptionHandler {
 record ErrorResponse(Instant timestamp,String path,String error,String message){}
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ErrorResponse> bad(IllegalArgumentException e,HttpServletRequest r){return ResponseEntity.badRequest().body(new ErrorResponse(Instant.now(),r.getRequestURI(),"VALIDATION_ERROR",e.getMessage()));}
 @ExceptionHandler(NoSuchElementException.class) ResponseEntity<ErrorResponse> notFound(NoSuchElementException e,HttpServletRequest r){return ResponseEntity.status(404).body(new ErrorResponse(Instant.now(),r.getRequestURI(),"NOT_FOUND",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e,HttpServletRequest r){return ResponseEntity.badRequest().body(new ErrorResponse(Instant.now(),r.getRequestURI(),"VALIDATION_ERROR",e.getBindingResult().getFieldError()!=null?e.getBindingResult().getFieldError().getDefaultMessage():"Invalid request"));}
}
