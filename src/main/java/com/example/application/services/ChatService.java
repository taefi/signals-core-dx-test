package com.example.application.services;

import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.ListSignal;

@AnonymousAllowed
@BrowserCallable
public class ChatService {

    public record Message(String text, String author) {}

    private final AuthenticatedUser authenticatedUser;

    public ChatService(AuthenticatedUser authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
    }

    private final ListSignal<Message> chatSignal = new ListSignal<>(Message.class);

    public ListSignal<Message> chatSignal() {
        return chatSignal;
    }

    // Followings are some helpers in case you need them, otherwise feel free to ignore or remove them:

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
