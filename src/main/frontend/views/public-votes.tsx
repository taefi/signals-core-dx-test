import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, RadioButton, RadioGroup, VerticalLayout } from "@vaadin/react-components";
import { effect, signal } from "@vaadin/hilla-react-signals";
import { useEffect } from "react";

export const config: ViewConfig = {
  menu: { order: 20, title: 'Public Votes', exclude: false },
  title: 'Public Votes',
};

// TODO: Use the full-stack signal for the voting in progress state:
const votingInProgress = signal(false);

// TODO: Use the full-stack signal for the vote count:
const voteCount = signal(0);

const numberOfSentRequests = signal(0);

function voteUp() {
  voteCount.value++;
}

export default function PublicVotes() {

  useEffect(() => {
    if (!votingInProgress.value) {
      return;
    }
    const runWithDelay = async () => {
      for (let i = 0; i < 250 && votingInProgress.value; i++) {
        voteUp();
        numberOfSentRequests.value++;
        await sleep(1);
      }
    };
    runWithDelay();
  }, [votingInProgress.value]);

  return (
    <VerticalLayout theme='padding'>
      <p>
        In this view, when the "Start Voting" button is clicked, the vote count will increase by one every millisecond.
        When you manage to share the state of the <b>votingInProgress</b> between multiple users, all clients will send a lot of
        requests to the server at the same time to simulate concurrent voting by hundreds of users:
      </p>
      <RadioGroup label="Is voting in progress:" theme="horizontal">
        <RadioButton label="No"
                     checked={!votingInProgress.value}
                     onClick={() => votingInProgress.value = false}/>
        <RadioButton label="Yes"
                     checked={votingInProgress.value}
                     onClick={() => votingInProgress.value = true}/>
      </RadioGroup>
      <Button onClick={() => votingInProgress.value = !votingInProgress.value}
              theme={votingInProgress.value ? 'error' : ''}
      >{votingInProgress.value ? 'Stop' : 'Start'} Voting</Button>
      <br/>
      {numberOfSentRequests.value > 0
        ? <span>Sent {numberOfSentRequests.value} requests</span>
        : ''}
      <br/>
      <div>
        <span style={{paddingRight: '10px'}}>Vote count: {voteCount}</span>
      </div>
      <Button onClick={() => {
        voteCount.value = 0;
        numberOfSentRequests.value = 0;
      }}>Reset</Button>
    </VerticalLayout>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// No need to touch the following effect:
effect(() => {
  if (voteCount.value === 0) {
    numberOfSentRequests.value = 0;
  }
});
