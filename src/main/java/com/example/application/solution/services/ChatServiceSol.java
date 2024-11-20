package com.example.application.solution.services;

import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.ListSignal;
import com.vaadin.hilla.signals.operation.ReplaceValueOperation;
import com.vaadin.hilla.signals.operation.SetValueOperation;
import com.vaadin.hilla.signals.operation.ValidationResult;
import com.vaadin.hilla.signals.operation.ValueOperation;

@AnonymousAllowed
@BrowserCallable
public class ChatServiceSol {

    public record Message(String text, String author) {}

    private final AuthenticatedUser authenticatedUser;

    public ChatServiceSol(AuthenticatedUser authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
    }

    private final ListSignal<Message> chatSignal = new ListSignal<>(Message.class).withOperationValidator(
            operation -> {
                if (operation instanceof ValueOperation<Message> valueOp) {
                    if (valueOp.value().text().toLowerCase().contains("bad")) {
                        return ValidationResult.reject("Bad words are not allowed");
                    }
                }
                return ValidationResult.allow();
            });
    private final ListSignal<Message> adminSignal = chatSignal.withOperationValidator(
            operation -> {
                if (operation instanceof ValueOperation<Message> valueOp) {
                    if (isEditOperation(valueOp) &&
                            !currentUser().equals(valueOp.value().author())) {
                        return ValidationResult.reject("Admin users can only edit their own messages");
                    }
                }
                return ValidationResult.allow();
            });
    private final ListSignal<Message> userSignal = adminSignal.withOperationValidator(
            operation -> {
                if (operation instanceof ValueOperation<Message> valueOp) {
                    if (isEditOperation(valueOp)) {
                        return ValidationResult.reject("Editing messages is only allowed for admins");
                    }
                }
                return ValidationResult.allow();
            });

    private final ListSignal<Message> guestSignal = chatSignal.asReadonly();

    private boolean isEditOperation(ValueOperation<Message> operation) {
        return operation instanceof SetValueOperation<Message>
                || operation instanceof ReplaceValueOperation<Message>;
    }

    public ListSignal<Message> chatSignal() {
        return switch (currentUserRole()) {
            case ADMIN -> adminSignal;
            case USER -> userSignal;
            case GUEST -> guestSignal;
        };
    }

    private enum Role {
        ADMIN, USER, GUEST
    }

    private Role currentUserRole() {
        if (authenticatedUser.get().isEmpty()) {
            return Role.GUEST;
        }
        if(authenticatedUser.get().get()
                .getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.name()))) {
            return Role.ADMIN;
        } else {
            return Role.USER;
        }
    }

    private String currentUser() {
        return authenticatedUser.get().map(user -> user.getName()).orElse("Guest");
    }
}
