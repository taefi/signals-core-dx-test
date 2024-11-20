import { type ListSignal, useSignal, type ValueSignal } from "@vaadin/hilla-react-signals";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { Button, HorizontalLayout, Icon, Notification, Scroller, TextArea, VerticalLayout } from "@vaadin/react-components";

import type Message from "Frontend/generated/com/example/application/solution/services/ChatServiceSol/Message.js";

import { ChatServiceSol } from "Frontend/generated/endpoints.js";
import { useAuth } from "Frontend/util/auth.js";

export const config: ViewConfig = {
  menu: { order: 140, title: 'Chat (solution)', exclude: false },
  title: 'Chat (solution)',
};

const chatSignal: ListSignal<Message> = ChatServiceSol.chatSignal();

function MessageEditor({message, onRemove, isMyMessage}: {
  message: ValueSignal<Message>,
  onRemove: (signal: ValueSignal<Message>) => void,
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
                message.replace(message.value, {
                  text: messageText.value,
                  author: message.value.author
                });
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
                           onRemove={() => chatSignal.remove(message)}
                           isMyMessage={message.value.author.toLowerCase() === username.toLowerCase()}
                           key={index}/>)
        }
      </Scroller>
      <HorizontalLayout theme='spacing' style={{alignItems: 'BASELINE'}}>
        <TextArea value={newMessage.value} placeholder="Type in your message and press send..."
                  onValueChanged={(e => newMessage.value = e.detail.value)}
                  style={{height: '66px'}}/>
        <Button onClick={() => {
                          chatSignal.insertLast({text: newMessage.value, author: username})
                            .result.then(() => {}, (reason) => Notification.show(reason));
                          newMessage.value = '';
                        }}
                disabled={newMessage.value === ''}>Send</Button>
      </HorizontalLayout>
    </VerticalLayout>
  );
}
