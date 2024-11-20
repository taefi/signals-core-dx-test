package com.example.application.solution.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.ListSignal;

@BrowserCallable
@AnonymousAllowed
public class TodoServiceSol {

    record TodoItem(String text, boolean done) {}

    private final ListSignal<TodoItem> todoItems = new ListSignal<>(TodoItem.class);

    public ListSignal<TodoItem> todoItems() {
        return todoItems;
    }
}
