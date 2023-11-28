import React, { useState, useEffect } from "react";
import "./budget.css";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import Alert from "./Alert";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import {Link} from "react-router-dom";
import Piechart from "./Piechart";

function BudgetApp() {
    // *************** State Values ***************
    // Expenses,addExpenses
    const navigate = useNavigate();
    const db = getFirestore(app);
    const [expenses, setExpenses] = useState([]);

    // Single expense
    const [charge, setCharge] = useState("");

    // Single expense
    const [amount, setAmount] = useState("");

    // Alert
    const [alert, setAlert] = useState({ show: false });

    // alert
    const [edit, setEdit] = useState(false);

    // edit item
    const [id, setId] = useState(0);

    //user data
    const [uid, setUid] = useState('');

    // *************** UseEffect **************

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                navigate("/");
            }
        }
        )
    }, []);

    useEffect(() => {
        getAllExpenses();
    }, [uid]);
    // *************** Functionalities ***************

    const getAllExpenses = async () => {
        const q = query(collection(db, "expenses"), where("user", "==", uid));
        const querySnapshot = await getDocs(q);
        let dbExpenses = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const id = doc.id;
            const charge = doc.data().expenseType;
            const amount = doc.data().expense;
            const expense = { amount, charge, id };
            dbExpenses.push(expense);
        }
        )
        setExpenses(dbExpenses);
    }

    const handleCharge = e => {
        setCharge(e.target.value);
    };

    const handleAmount = e => {
        setAmount(e.target.value);
    };

    const handleAlert = ({ type, text }) => {
        setAlert({ show: true, type, text });
        setTimeout(() => {
            setAlert({ show: false });
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (charge !== "" && amount >= 0) {
            if (edit) {
                let singleExpense = expenses.find(item => item.id === id);
                const expense = amount;
                const expenseType = charge;
                const expenseDocRef = doc(db, 'expenses', singleExpense.id)
                try {
                    const updater = {
                        expense: expense,
                        expenseType: expenseType
                    }
                    await updateDoc(expenseDocRef, {
                        expense: expense,
                        expenseType: expenseType
                    })
                } catch (err) {
                    handleAlert(err)
                }
                setEdit(false);
                getAllExpenses();
                handleAlert({ type: "success", text: "Edited Successfully" });
            } else {
                const expense = {
                    expenseType: charge,
                    expense: amount,
                    user: uid
                }
                await addDoc(collection(db, 'expenses'), expense);
                getAllExpenses();
                handleAlert({ type: "success", text: "Item Added" });
            }
            setCharge("");
            setAmount("");
        } else {
            // Handle Alert call
            handleAlert({ type: "danger", text: `Enter valid Values!` });
        }
    };

    // Clear all items

    const clearItems = () => {
        expenses.forEach(async (expense) => {
            if (!uid) {
                handleAlert("You're not logged in!")
                return;
            }
            const expenseDocRef = doc(db, 'expenses', expense.id)
            try {
                await deleteDoc(expenseDocRef)
            } catch (err) {
                handleAlert(err)
            }
        })
        getAllExpenses();
        handleAlert({ type: "success", text: "List Cleared" });
    };

    // deleting single items
    const deleteHandler = async (id) => {
        if (!uid) {
            handleAlert("You're not logged in!")
            return;
        }
        const expenseDocRef = doc(db, 'expenses', id)
        try {
            await deleteDoc(expenseDocRef)
        } catch (err) {
            handleAlert(err)
        }
        getAllExpenses();
        handleAlert({ type: "success", text: "Item Deleted" });
    };

    // editing single items
    const editHandler = async (id) => {
        let expense = expenses.find(item => item.id === id);
        let { charge, amount } = expense;
        setCharge(charge);
        setAmount(amount);
        setEdit(true);
        setId(id);
    };

    return (
        <>
            {alert.show && <Alert type={alert.type} text={alert.text} />}
            <div className="nav">
            <h1 className="main-header">Budget Calculator</h1>
            <Link to="/logout">
            <button className="logout__button">  
            Logout     
            </button>
            </Link>
            </div>
            <div className="App">
                <ExpenseForm
                    charge={charge}
                    amount={amount}
                    handleAmount={handleAmount}
                    handleCharge={handleCharge}
                    handleSubmit={handleSubmit}
                    edit={edit}
                />
                <ExpenseList
                    expenses={expenses}
                    deleted={deleteHandler}
                    edited={editHandler}
                    clearItems={clearItems}
                />{" "}
            </div>
            <h1>
                Total Spending:{" "}
                <span className="total">
                    $
                    {expenses.reduce((acc, curr) => {
                        return (acc += parseInt(curr.amount));
                    }, 0)}
                </span>
            </h1>
            <Piechart expenses={expenses}/>
        </>
    );
}

export default BudgetApp;
