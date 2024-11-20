import { Signal, signal, useSignal } from "@vaadin/hilla-react-signals";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { Button, HorizontalLayout, Icon, Scroller, TextArea, VerticalLayout } from "@vaadin/react-components";

import type Message from "Frontend/generated/com/example/application/solution/services/ChatServiceSol/Message.js";

import { useAuth } from "Frontend/util/auth.js";

export const config: ViewConfig = {
  menu: { order: 40, title: 'Chat', exclude: false },
  title: 'Chat',
};

const chatSignal =  signal<Array<Signal<{text: string, author: string}>>>([]);

function MessageEditor({message, onRemove, isMyMessage}: {
  message: Signal<Message>,
  onRemove: (signal: Signal<Message>) => void,
  isMyMessage: boolean
}) {
  const editing = useSignal(false);
  const messageText = useSignal('');
  return (
    <HorizontalLayout theme='spacing' style={{ alignItems: 'BASELINE' }}>
      <TextArea readonly={true}
                label={isMyMessage ? 'Me:' : message.value.author + ':'}
                value={message.value.text}
      />
      {editing.value
        ? <TextArea value={messageText.value}
                    onValueChanged={(e) => messageText.value = e.detail.value}/>
        : null}
      <Button hidden={editing.value} theme="icon"
              onClick={() => {
                editing.value = true;
                messageText.value = message.value.text;
              }}>
        <Icon icon="vaadin:pencil" />
      </Button>
      <Button hidden={!isMyMessage || editing.value} theme="icon error" onClick={() => onRemove(message)}>
        <Icon icon="vaadin:trash" />
      </Button>
      <Button hidden={!editing.value} theme="icon"
              onClick={() => {
                message.value = {
                  text: messageText.value,
                  author: message.value.author
                };
                editing.value = false;
              }}>
        <Icon icon="vaadin:check" />
      </Button>
      <Button hidden={!editing.value} theme="icon error"
              onClick={() => {
                messageText.value = '';
                editing.value = false;
              }}>
        <Icon icon="vaadin:close-small" />
      </Button>
    </HorizontalLayout>
  );
}

function addItem(message: Signal<{text: string, author: string}>) {
  chatSignal.value = [...chatSignal.value, message];
}

function removeItem(message: Signal<{text: string, author: string}>) {
  chatSignal.value = chatSignal.value.filter(item => item !== message);
}

export default function ChatView() {
  const { state, logout } = useAuth();
  const username = state.user !== undefined ? state.user.name : 'Anonymous';
  const newMessage = useSignal<string>('');

  return (
    <VerticalLayout theme='padding'>
      <h3>Welcome {username}!</h3>
      <span>The word "bad" is not allowed in this chat, and the message will not be accepted!</span>
      <span>But, you can be creative by saying things like "b-a-d" or "B A D"</span>
      <Scroller style={{height: '65vh',
                  width: '100%',
                  borderBottom: '1px solid var(--lumo-contrast-20pct)',
                  borderTop: '1px solid var(--lumo-contrast-20pct)',
                }}
                scrollDirection="vertical">
        {chatSignal.value.length === 0
          ? <>No messages yet...</>
          : chatSignal.value.map((message, index) =>
            <MessageEditor message={message}
                           onRemove={() => removeItem(message)}
                           isMyMessage={message.value.author.toLowerCase() === username.toLowerCase()}
                           key={index}/>)
        }
      </Scroller>
      <HorizontalLayout theme='spacing' style={{alignItems: 'BASELINE'}}>
        <TextArea value={newMessage.value} placeholder="Type in your message and press send..."
                  onValueChanged={(e => newMessage.value = e.detail.value)}
                  style={{height: '66px'}}/>
        <Button onClick={() => {
          addItem(signal({text: newMessage.value, author: username}));
          newMessage.value = '';
        }} disabled={newMessage.value === ''}>Send</Button>
      </HorizontalLayout>
    </VerticalLayout>
  );
}
