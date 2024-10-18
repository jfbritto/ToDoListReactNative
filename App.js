import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://192.168.1.2:8000/api/todos/');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await axios.post('http://192.168.1.2:8000/api/todos/', { title: newTodo, completed: false });
      setTodos([...todos, response.data]);
      setNewTodo('');
    }
  };

  const toggleComplete = async (id, completed) => {
    await axios.patch(`http://192.168.1.2:8000/api/todos/${id}/`, { completed: !completed });
    fetchTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Add a new task"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)}>
            <View style={[styles.todoItem, item.completed && styles.completed]}>
              <Text style={styles.todoText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#5cb85c',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  todoItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  todoText: {
    fontSize: 18,
    color: '#333',
  },
  completed: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
});
