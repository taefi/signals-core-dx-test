package com.example.application.solution.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.NumberSignal;
import com.vaadin.hilla.signals.ValueSignal;

@BrowserCallable
@AnonymousAllowed
public class VoteServiceSol {

    private final NumberSignal voteCount = new NumberSignal();
    private final ValueSignal<Boolean> votingInProgress = new ValueSignal<>(false, Boolean.class);

    public NumberSignal voteCount() {
        return voteCount;
    }

    public ValueSignal<Boolean> votingInProgress() {
        return votingInProgress;
    }
}
