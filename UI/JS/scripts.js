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
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyDhNAj5vXDe3GNb1rj9ES0puJNpn80UPkY",
    authDomain: "trello2-0.firebaseapp.com",
    projectId: "trello2-0",
    storageBucket: "trello2-0.appspot.com",
    messagingSenderId: "403423516639",
    appId: "1:403423516639:web:31a02b686b40df0a51166a"
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
                <div class="task-text">
                    ${itemValue}
                </div>
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
                <div class="task-text">
                    ${itemValue}
                </div>
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
                    let temp = target.parentNode.parentNode.previousSibling.previousSibling;
                    let text = temp.textContent;
                    if (temp.tagName === "DIV") {
                        temp.outerHTML = `<textarea class="task-text">
                        ${text} </textarea>`;
                    }
                    if (temp.tagName === "TEXTAREA") {
                        text = temp.value;
                        this.editTask(target.parentNode.parentNode.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.id, text);
                        temp.outherHTML = `<div class="task-text">
                        ${text} </div>`;
                    }
                }
                if (target.parentNode.classList.contains("delete-button")) {
                    this.deleteTask(target.parentNode.parentNode.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.id);
                }
                if (target.parentNode.classList.contains("close-button")) {
                    this.deleteTable(target.parentNode.parentNode.parentNode.id);
                }
            });
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
        console.log("adding");
        this.#firestoreService.getTableFeed();
    }

    deleteTable(id) {
        this.#firestoreService.delete(id);
        this.#firestoreService.getTableFeed();
    }

    addTask(tableId, taskText) {
        this.#firestoreService.addTask(tableId, taskText);
        this.#firestoreService.getTable(tableId);
    }

    deleteTask(tableId, taskId) {
        this.#firestoreService.deleteTask(tableId, taskId);
        this.#firestoreService.getTable(tableId);
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
                            console.log("aaaa");
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
        await deleteDoc(doc(this.#db, "tableCollection", `${id}`));
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
// a.addTable();
// a.deleteTable("OGW0mrsSwDwmNiSYIziq");
// a.addTask("table1", "mdkcmsdk");
// a.deleteTask("table1", "Task1");
// a.editTask("table1", "jpICh74EfmrFwwBJIjsg", "211");
// console.log(a.getTableFeed());
// let myMap = new Map;
// let table1 = new Map;
// let table2 = new Map;
// table1.set("task1", "dksod");
// table1.set("task2", "dkfkds");
// table2.set("task1", "dksodsdsfdd");
// table2.set("task2", "dkfkdsfdsdffjkdhsfjksdhfjkdfhsdifhdoifdsывлофытволытволтолыфтволфытволытвлофытвлофытлофвтфолвтфыолтвфыолhuoifhdsoifjsdoifjdsoifjsdfs");
// myMap.set("table1", table1);
// myMap.set("table2", table2);
// tableFeedRender(myMap, "main");
// console.log(a.getTableFeed());
a.getTableFeed();

