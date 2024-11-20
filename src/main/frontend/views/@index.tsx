import { ViewConfig } from "@vaadin/hilla-file-router/types.js";

export const config: ViewConfig = {
  menu: {
    order: 0,
    title: 'Welcome',
    exclude: true
  }
};

export default function Index() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
      <h3>Welcome to the Full-Stack Signal's DX Test!</h3>
      <p>
        For many parts of the tasks, there are pre-existing views for your
        convenience, so that you can focus on writing the code that will make
        them work as expected. However, you are free to modify them as you see
        fit. You can also create new views if you need to.
      </p>
      <p>
        Also, there are solution views that you can use to compare your work
        with. They are not part of the test, but they can be useful to check your
        work against. However, they are not perfect, so don't take them as the
        only way.
      </p>
    </div>
  );
}