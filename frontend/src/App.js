import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [entervalue, setentervalue] = useState("");
    const [fruit, setfruit] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/fruits")
            .then(response => {
                console.log(response.data);
                setfruit(response.data); // Update state with received data
            })
            .catch(error => {
                console.log('There was an error fetching the fruits:', error);
                console.log(error.response?.data);
            });
    }, []);

    function handlevalue(e) {
        setentervalue(e.target.value);
    }

    function add() {
        axios.post("http://localhost:5000/addfruit", { newfruit: entervalue })
            .then(response => {
                setfruit([...fruit, response.data]); // Use the full saved fruit
                setentervalue("");
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error adding the fruit:', error);
                console.log(error.response?.data);
            });
    }

    function edit(id) {
        const fruitToEdit = fruit.find(f => f._id === id);
        if (fruitToEdit) {
            setentervalue(fruitToEdit.name); // Make sure you use .name (lowercase)
            setEditId(id);
        }
    }

    function update() {
        const updatedFruit = { name: entervalue };
        axios.put(`http://localhost:5000/updatefruit/${editId}`, updatedFruit)
            .then(response => {
                const newFruitList = fruit.map(item =>
                    item._id === editId ? response.data : item
                );
                setfruit(newFruitList);
                setentervalue("");
                setEditId(null);
            })
            .catch(error => {
                console.error('There was an error updating the fruit:', error);
                console.log(error.response?.data);
            });
    }

    function remove(id) {
        axios.delete(`http://localhost:5000/deletefruit/${id}`)
            .then(() => {
                const newFruitList = fruit.filter(item => item._id !== id);
                setfruit(newFruitList);
            })
            .catch(error => {
                console.error('There was an error deleting the fruit:', error);
                console.log(error.response?.data);
            });
    }

    return (
        <div style={styles.container}>
            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    onChange={handlevalue}
                    value={entervalue}
                    placeholder="Enter fruit name"
                />
                <button style={styles.button} onClick={editId !== null ? update : add}>
                    {editId !== null ? "Update" : "Add"}
                </button>
            </div>
            <div style={styles.listContainer}>
                {fruit.map((item) => (
                    <div key={item._id} style={styles.itemContainer}>
                        <h2 style={styles.item}>{item.name}</h2> {/* Updated to .name */}
                        <div>
                            <button style={styles.editButton} onClick={() => edit(item._id)}>Edit</button>
                            <button style={styles.deleteButton} onClick={() => remove(item._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// stylesheet
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#D2B48C', // light brown
        minHeight: '100vh'
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        marginRight: '10px'
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer'
    },
    listContainer: {
        width: '100%',
        maxWidth: '600px'
    },
    itemContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        backgroundColor: '#e0e0e0', // grey color for fruit items
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    item: {
        margin: 0,
        fontSize: '20px'
    },
    editButton: {
        padding: '5px 10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#ffc107',
        color: 'white',
        cursor: 'pointer',
        marginRight: '5px'
    },
    deleteButton: {
        padding: '5px 10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer'
    }
};

export default App;
