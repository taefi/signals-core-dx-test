import {
  Button,
  Checkbox,
  Icon,
  TextField,
  TextArea,
  HorizontalLayout,
  VerticalLayout
} from "@vaadin/react-components";
import { Signal, signal, useSignal } from "@vaadin/hilla-react-signals";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";

export const config: ViewConfig = {
  menu: { order: 30, title: 'Todo List', exclude: false },
  title: 'Todo List',
};

const todoItems = signal<Array<Signal<{text: string, done: boolean}>>>([]);

function removeItem(todoItem: Signal<{text: string, done: boolean}>) {
  todoItems.value = todoItems.value.filter(item => item !== todoItem);
}

function addItem(item: {text: string, done: boolean}) {
  todoItems.value = [...todoItems.value, signal(item)];
}

export default function TodoListView(){
  const newTodoValue = useSignal<string>('');

  return (
    <>
      <VerticalLayout theme="padding">
        <p>
          This view is already implemented with the functionalities of adding, removing, editing, and marking tasks as done.
          Your task here is to share the state of the to-do list with other users in real-time:
        </p>
        <HorizontalLayout theme="spacing padding" style={{alignItems: 'BASELINE'}}>
          <h3>To-do list:</h3>
        </HorizontalLayout>
        {todoItems.value.length === 0
          ? <span style={{padding: '10px'}}>No tasks yet...</span>
          : todoItems.value.map((item, index) =>
            <TodoComponent todoItem={item}
                           key={index}
                           onRemove={() => removeItem(item)}/>)
        }
        <HorizontalLayout theme='padding spacing'>
          <TextField placeholder="What's on your mind?"
                     value={newTodoValue.value}
                     onValueChanged={(e) => newTodoValue.value = e.detail.value} />
          <Button onClick={() => handleAddTask(newTodoValue)}>Add task</Button>
        </HorizontalLayout>
      </VerticalLayout>
    </>
  );
}

function handleAddTask(newTodoValue: Signal<string>) {
  addItem({ text: newTodoValue.value, done: false });
  newTodoValue.value = '';
}

function TodoComponent({todoItem, onRemove}: {
  todoItem: Signal<{text: string, done: boolean}>,
  onRemove: (signal: Signal<{text: string, done: boolean}>) => void,
}) {
  const editing = useSignal(false);
  const todoText = useSignal('');

  return (
    <HorizontalLayout theme='spacing'
                      style={{ alignItems: 'BASELINE', paddingLeft: '10px' }} >
      <Checkbox label={todoItem.value.text}
                    checked={todoItem.value.done}
                    onCheckedChanged={(e) => {
                      todoItem.value = {
                        text: todoItem.value.text,
                        done: e.detail.value
                      };
                    }}/>
      {editing.value
        ? <TextArea value={todoText.value}
                    onValueChanged={(e) => todoText.value = e.detail.value}/>
        : null}
      <Button theme="icon"
              hidden={editing.value}
              onClick={() => {
                editing.value = true;
                todoText.value = todoItem.value.text;
              }}>
        <Icon icon="vaadin:pencil" />
      </Button>
      <Button theme="icon error"
              hidden={editing.value}
              onClick={() => onRemove(todoItem)}>
        <Icon icon="vaadin:trash" />
      </Button>
      <Button theme="icon"
              hidden={!editing.value}
              onClick={() => {
                todoItem.value = {
                  text: todoText.value,
                  done: todoItem.value.done
                };
                editing.value = false;
              }}>
        <Icon icon="vaadin:check" />
      </Button>
      <Button theme="icon error"
              hidden={!editing.value}
              onClick={() => {
                todoText.value = '';
                editing.value = false;
              }}>
        <Icon icon="vaadin:close-small" />
      </Button>
    </HorizontalLayout>
  );
}
