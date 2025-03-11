package com.team3.FoodSaver.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

	private final AuthenticationManager authenticationManager;

	public LoginController(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
		UsernamePasswordAuthenticationToken authRequest = 
				new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password());
		
		try {
			Authentication auth = authenticationManager.authenticate(authRequest);
			return ResponseEntity.ok("Login Successful");
		}
		catch (BadCredentialsException e)  {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
		}
		catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed - internal error");
		}
	}

	public record LoginRequest(String username, String password) {}

}