<template>
    <div v-if="store.isAuthenticated">
        <h1>TODOS</h1>

        Add Todo:
        <input type="text" v-model="newTodo" /><button @click="handleAddTodo">Add</button>
        <ul v-if="!pending">
            <li v-for="todo in todos" :key="todo.id">
                <span>{{ todo.text }} ( {{ todo.id }}), {{ todo.done }}</span>
                <button @click="handleUpdateTodo(todo.id)">Update to bob</button>
                <button @click="handleRemoveTodo(todo.id)">DELETE</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
//import { useFirestore } from 'vuefire'
import { ref } from 'vue'
//const db = useFirestore()
const newTodo = ref('')
import { todosRef, db } from '@/firebaseApp';

import { useDatabaseList, useDatabaseObject } from 'vuefire'
//push adds, set updates.
import { push, set, remove } from 'firebase/database';
import { ref as dbRef } from 'firebase/database'
import { useStore } from '@/store';
//both of these work
//const todos = useDatabaseList(todosRef)
//const todos = useDatabaseList(dbRef(db, 'todos'))
const store = useStore();
//const token = computed(() => store.token);

//these single item objects work, but if I refresh page, they both come back undefined.
//the better way to go is to  load the data with the deconstructed objects as below for _someTodo.
//const oneTodo = useDatabaseObject(todosRef, 'todos/-NpC7L43WZr8J2dNskmQ')
//console.log('oneTodo', oneTodo.value);

//const someTodo = ref(null);
//const someTodo = useDatabaseObject(dbRef(db, 'todos/-NpAfKhHyFDPgZcGB_eC'), { once: false })
// e     slint-disable-next-line
// const _someTodo = computed(() => {
//     const result = useDatabaseObject(dbRef(db, 'todos/-NpAfKhHyFDPgZcGB_eC'))
//     console.log('someTodo hi', result.value);
//     return result;
// })

const {
    // rename the Ref to something more meaningful
    data: _someTodo,
    // is the subscription still pending?
    _somepending,
    // did the subscription fail?
    _someerror,
    // A promise that resolves or rejects when the initial state is loaded
    promise: somepromise,
    //this useDatabaseObject works.
} = useDatabaseObject(dbRef(db, 'todos/-NpC7L43WZr8J2dNskmQ'))
//this one returns all values, that id argument isn't really a thing.
//} = useDatabaseObject(dbRef(db, 'todos', '-NpAfKhHyFDPgZcGB_eC'))



somepromise.value.then(() => {
    //console.log('Initial state loaded');
    // Set isLoaded to true when the Promise resolves
    //isLoaded.value = true;
    //console.log('someTodoB', _someTodo.value);
    //console.log('someTodoBtext', _someTodo.value.text);

}).catch((err) => {
    console.error('Failed to load initial state:', err);
});
// import { watch } from 'vue';
// watch(somepending, (newVal) => {
//     if (newVal) {
//         console.log('someTodoB', _someTodo.value);
//         console.log('someTodoBtext', _someTodo.value.text);
//     }
// });

// if (someTodo.value) {
//     console.log('someTodo', someTodo.value);
//     console.log('someTodotext', someTodo.value.text);
// }
//console.log('someTodo', someTodo.value);
//console.log('someTodotext', someTodo.value.text);

//import { watch } from 'vue';
// watch(someTodo, (newVal) => {
//     if (newVal) {
//         console.log('someTodoB', newVal);
//         console.log('someTodoBtext', newVal.text);
//     }
// });


// watch(() => useDatabaseObject(dbRef(db, 'todos/-NpAfKhHyFDPgZcGB_eC')), (newVal) => {
//     someTodo.value = newVal.value;
//     console.log('someTodo X', someTodo.value);
// });

//const pending = ref(false);
const {
    // rename the Ref to something more meaningful
    data: todos,
    // is the subscription still pending?
    pending,
    // did the subscription fail?
    //error,
    // A promise that resolves or rejects when the initial state is loaded
    //promise,
} = useDatabaseList(todosRef)

// promise.then(() => {
//     console.log('Initial state loaded');
// }).catch((err) => {
//     console.error('Failed to load initial state:', err);
//     console.error('promise error', error)
// });

const handleAddTodo = () => {
    push(todosRef, {
        text: newTodo.value,
        done: false
    })
    // db.collection('todos').add({
    //     text: newTodo.value,
    //     done: false
    // })
    newTodo.value = ''
}

//the baseline update case will reset the firebase id to a numeric id.
const handleUpdateTodo = (todoId) => {
    const updatedText = 'Bob';
    //no, this is the wrong way, this is for firestore.
    // const todoRef = doc(db, 'todos', todoId);
    // updateDoc(todoRef, {
    //     text: updatedText
    // });

    const todo = todos.value.find(todo => todo.id === todoId);
    if (!todo) {
        console.error(`No todo found with id ${todoId}`);
        return;
    }

    // Update the todo
    todo.text = updatedText;

    // Update the todos in Firestore

    //this updates the entire database, and resets the id to a numeric id.
    //set(todosRef, todos.value);

    //this updates the single todo, and does not reset the id for anything
    const todoRef = dbRef(db, `todos/${todoId}`);
    set(todoRef, todo);
}

const handleRemoveTodo = (todoId) => {
    const todoRef = dbRef(db, `todos/${todoId}`);
    remove(todoRef);
}

</script>