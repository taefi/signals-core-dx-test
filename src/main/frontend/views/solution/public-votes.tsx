import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, RadioButton, RadioGroup, VerticalLayout } from "@vaadin/react-components";
import { VoteServiceSol } from "Frontend/generated/endpoints.js";
import { effect, signal } from "@vaadin/hilla-react-signals";
import { useEffect } from "react";

export const config: ViewConfig = {
  menu: { order: 120, title: 'Public Votes (solution)', exclude: false },
  title: 'Public Votes (solution)',
};

const votingInProgress = VoteServiceSol.votingInProgress({defaultValue: false});

const voteCount = VoteServiceSol.voteCount()

const numberOfSentRequests = signal(0);

function voteUp() {
  voteCount.incrementBy(1);
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

effect(() => {
  if (voteCount.value === 0) {
    numberOfSentRequests.value = 0;
  }
});
