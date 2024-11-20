import { Button, VerticalLayout } from "@vaadin/react-components";
import { signal } from "@vaadin/hilla-react-signals";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";

export const config: ViewConfig = {
  menu: { order: 10 },
};

// TODO: Figure out the replacement the following signal:
const counter = signal(0);

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