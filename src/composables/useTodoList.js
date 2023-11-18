import { ref } from 'vue';

//外部から使えるようにexportする
export const useTodoList = () => {
  //ローカルストレージにtodoListが存在していればparseし、
  //なければundifinedになるため空配列をセットする。
  const ls = localStorage.todoList;
  const todoListRef = ref([]);
  todoListRef.value = ls ? JSON.parse(ls) : [];

  //追加処理
  const add = (task) => {
    const id = new Date().getTime();
    todoListRef.value.push({ id: id, task: task, checked: false });
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  //TODOリストからIDを元にTODO情報を取得
  const findById = (id) => {
    return todoListRef.value.find((todo) => todo.id === id);
  };

  //TODOリストからIDを元にそのインデックスを取得
  const findIndexById = (id) => {
    return todoListRef.value.findIndex((todo) => todo.id === id);
  };

  //リアクティブにする
  const editId = ref(-1);
  //表示処理
  const show = (id) => {
    const todo = findById(id);
    editId.value = id;
    //画面処理させるために返す
    return todo.task;
  };

  //編集処理
  const edit = (task) => {
    const todo = findById(editId.value);
    const idx = findIndexById(editId.value);
    todo.task = task;
    todoListRef.value.splice(idx, 1, todo);
    localStorage.todoList = JSON.stringify(todoListRef.value);
    editId.value = -1;
  };

  //削除処理
  const del = (id) => {
    const todo = findById(id);
    const delMsg = '「' + todo.task + '」を削除しますか？';
    if (!confirm(delMsg)) {
      return;
    }

    const idx = findIndexById(id);
    todoListRef.value.splice(idx, 1);
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  //チェック処理
  const check = (id) => {
    const todo = findById(id);
    const idx = findIndexById(id);
    todo.checked = !todo.checked;
    todoListRef.value.splice(idx, 1, todo);
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  return { todoListRef, add, show, edit, del, check };
};
