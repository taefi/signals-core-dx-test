import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, VerticalLayout } from "@vaadin/react-components";
import { VoteServiceSol } from "Frontend/generated/endpoints.js";

export const config: ViewConfig = {
    menu: { order: 110, title: 'Vote (solution)', exclude: false },
    title: 'Vote (solution)',
};

const counter = VoteServiceSol.voteCount();

export default function Vote() {

  return (
    <VerticalLayout theme='padding'>
      <div>
        <span style={{paddingRight: '10px'}}>Vote count: {counter}</span>
        <Button onClick={() => counter.value++}>
          Vote Up!
        </Button>
      </div>
    </VerticalLayout>
  );
}