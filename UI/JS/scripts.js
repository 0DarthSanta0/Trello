import {initializeApp} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js"
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    getDoc,
    setDoc,
    query,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyA6WRkqfryOEs1XIeC7e6lNicmvzqdlOrU",
    authDomain: "trello3-0.firebaseapp.com",
    projectId: "trello3-0",
    storageBucket: "trello3-0.appspot.com",
    messagingSenderId: "747405823861",
    appId: "1:747405823861:web:6f5806ef0e97ef7bb38d3c"
};

function tableRender(tableMap, tableId) {
    const table = document.getElementById(tableId);
    let temp = `<div class="table-item-head row">
            <button class="close-button">
                <img src="img/close.svg" alt="exit">
            </button>
        </div>
        <div class="table-item-content column">`;
    tableMap.forEach((itemValue, itemKey) => {
        temp += `<div class="task-item row" id="${itemKey}">
                <div class="task-text">${itemValue}</div>
                <div class="task-item-tools column">
                    <button class="edit-button">
                        <img src="img/editButton.png"  alt="edit">
                    </button>
                    <button class="delete-button">
                        <img src="img/deleteButton.png" alt="delete">
                    </button>
                </div>
            </div>`;
    });
    temp += ` </div>
        <div class="table-item-bottom">
            <button class="add-new-task">
                Add
            </button>
        </div>`;
    table.innerHTML = temp;
}

function tableFeedRender(dataMap, elementId) {
    const main = document.getElementById(elementId);
    console.log("data", dataMap);
    let temp = "";
    dataMap.forEach((value, key) => {
        console.log(key, value);
        temp += ` <div class="table-item column" id="${key}">
        <div class="table-item-head row">
            <button class="close-button">
                <img src="img/close.svg" alt="exit">
            </button>
        </div>
        <div class="table-item-content column">`;
        value.forEach((itemValue, itemKey) => {
            temp += `<div class="task-item row" id="${itemKey}">
                <div class="task-text">${itemValue}</div>
                <div class="task-item-tools column">
                    <button class="edit-button">
                        <img src="img/editButton.png"  alt="edit">
                    </button>
                    <button class="delete-button">
                        <img src="img/deleteButton.png" alt="delete">
                    </button>
                </div>
            </div>`;
        });
        temp += `</div>
        <div class="table-item-bottom">
            <button class="add-new-task">
                Add
            </button>
        </div>
    </div>`;
    });
    main.innerHTML = temp;
}

class TrelloController {
    #firestoreService;

    constructor(config) {
        this.#firestoreService = new FirestoreService(config);

        window.addEventListener("load", () => {
            const newTableButton = document.getElementsByClassName("add-new-table")[0];
            newTableButton.addEventListener("click", () => {
                this.addTable();
            });
            const main = document.getElementById("main");
            main.addEventListener("click", (e) => {
                const target = e.target;
                if (target.classList.contains("add-new-task")) {
                    this.addTask(target.parentNode.parentNode.id, "New Task");
                }
                if (target.parentNode.classList.contains("edit-button")) {
                    e.preventDefault();
                    let temp = target.parentNode.parentNode.previousSibling.previousSibling;
                    let text = temp.textContent;
                    if (temp.tagName === "DIV") {
                        temp.outerHTML = `<textarea class="task-text">${text}</textarea>`;
                    }
                    if (temp.tagName === "TEXTAREA") {
                        text = temp.value + " ";
                        this.editTask(target.parentNode.parentNode.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.id, text);
                        temp.outherHTML = `<div class="task-text">${text}</div>`;
                    }
                }
                if (target.parentNode.classList.contains("delete-button")) {
                    this.deleteTask(target.parentNode.parentNode.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.id);
                }
                if (target.parentNode.classList.contains("close-button")) {
                    this.deleteTable(target.parentNode.parentNode.parentNode.id);
                }
            });
            main.onmousedown = (e) => {
                const target = e.target.parentNode;
                if (e.target.tagName === "TEXTAREA") {
                    return;
                }
                if (target.classList.contains("task-item")) {
                    const item = document.getElementById(target.id);
                    let tableId = target.parentNode.parentNode.id;
                    let taskId= target.id;
                    let text = e.target.textContent;
                    item.ondragstart = function() {
                        return false;
                    };
                    item.style.position = 'absolute';
                    moveAt(e);
                    document.body.appendChild(item);
                    item.style.zIndex = 1000;
                    function moveAt(f) {
                        console.log(item);
                        item.style.left = f.pageX - item.offsetWidth / 2 + 'px';
                        item.style.top = f.pageY - item.offsetHeight / 2 + 'px';
                    };
                    document.onmousemove = function (f) {
                        moveAt(f);
                    };
                    document.onmouseup = (event) => {
                        document.body.removeChild(item);
                        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                        let newTableId = 0;
                        if (elemBelow.id === "main" || elemBelow.tagName === "BODY" || elemBelow.tagName === "HEADER") {
                            this.#firestoreService.getTable(tableId);
                            document.onmousemove = null;
                            document.onmouseup = null;
                            return;
                        }
                        for (let i = 0; i < 6; ++i) {
                            if (elemBelow.classList.contains("table-item")) {
                                newTableId = elemBelow.id;
                                break;
                            }
                            elemBelow = elemBelow.parentNode;
                        }
                        if (newTableId === tableId || newTableId === 0) {
                            this.#firestoreService.getTable(tableId);
                            document.onmousemove = null;
                            document.onmouseup = null;
                            return;
                        }
                        this.#firestoreService.deleteTask(tableId, taskId);
                        this.#firestoreService.addTask(newTableId, text);
                        this.#firestoreService.getTableFeed();
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            };
        });
    }

    getTableFeed() {
        return this.#firestoreService.getTableFeed();
    }

    getTable() {
        return this.#firestoreService.getTable();
    }

    addTable() {
        this.#firestoreService.addTable();
        this.#firestoreService.getTableFeed();
    }

    deleteTable(id) {
        this.#firestoreService.deleteTable(id);
        this.#firestoreService.getTableFeed();
    }

    addTask(tableId, taskText) {
        this.#firestoreService.addTask(tableId, taskText);
        this.#firestoreService.getTable(tableId);
    }

    deleteTask(tableId, taskId) {
        this.#firestoreService.deleteTask(tableId, taskId);
        this.#firestoreService.getTableFeed();
    }

    editTask(tableId, taskId, newText) {
        this.#firestoreService.editTask(tableId, taskId, newText);
    }
}

class FirestoreService {
    #app;
    #db;

    constructor(config) {
        this.#app = initializeApp(config);
        this.#db = getFirestore(this.#app);
    }

    getTableFeed() {
        let tableCollection = new Map;
        const tempTableDoc = query(collection(this.#db, "tableCollection"));
        onSnapshot(tempTableDoc, (apiCollectionDocs) => {
            let index1 = 0;
            apiCollectionDocs.forEach((viewItem) => {
                index1++;
                const documentsCollection = query(
                    collection(this.#db, "tableCollection", viewItem.id, "Tasks")
                );
                let tasksCollection = new Map;
                onSnapshot(documentsCollection, (subCollectionsName) => {
                    let index2 = 0;
                    subCollectionsName.forEach((item) => {
                        index2++;
                        tasksCollection.set(item.id, item.data().text);
                        if (index1 === apiCollectionDocs.docs.length && index2 == subCollectionsName.docs.length) {
                            tableFeedRender(tableCollection, "main");
                        }
                    });
                });
                tableCollection.set(viewItem.id, tasksCollection);
            });
        });
    }

    getTable(tableId) {
        const documentsCollection = query(
            collection(this.#db, "tableCollection", tableId, "Tasks")
        );
        let tasksCollection = new Map;
        onSnapshot(documentsCollection, (subCollectionsName) => {
            let index1 = 0;
            subCollectionsName.forEach((item) => {
                index1++;
                // console.log(`${item.id} + ${item.data().text}`);
                tasksCollection.set(item.id, item.data().text);
                if (index1 == subCollectionsName.docs.length) {
                    console.log("bbbb");
                    tableRender(tasksCollection, tableId);
                }
            });
        });
    }

    async addTable() {
        await addDoc(collection(this.#db, "tableCollection"), {});
    }

    async deleteTable(id) {
        const documentsCollection = query(
            collection(this.#db, "tableCollection", id, "Tasks")
        );
        onSnapshot(documentsCollection, (subCollectionsName) => {
            subCollectionsName.forEach(async (item) => {
                await deleteDoc(doc(this.#db, "tableCollection", id, "Tasks", item.id));
            });
        });
        await deleteDoc(doc(this.#db, "tableCollection", id));
    }

    async addTask(tableId, taskText) {
        const tempDoc = await doc(this.#db, "tableCollection", `${tableId}`);
        await addDoc(collection(tempDoc, "Tasks"), {
            text: taskText,
        });
    }

    async deleteTask(tableId, taskId) {
        await deleteDoc(doc(this.#db, "tableCollection", `${tableId}`, "Tasks", `${taskId}`));
    }

    async editTask(tableId, taskId, newText) {
        await setDoc(doc(this.#db, "tableCollection", `${tableId}`, "Tasks", `${taskId}`), {
            text: newText,
        });
    }
}

let a = new TrelloController(firebaseConfig);
a.getTableFeed();