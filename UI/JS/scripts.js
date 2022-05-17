import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js'
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
} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyDhNAj5vXDe3GNb1rj9ES0puJNpn80UPkY",
    authDomain: "trello2-0.firebaseapp.com",
    projectId: "trello2-0",
    storageBucket: "trello2-0.appspot.com",
    messagingSenderId: "403423516639",
    appId: "1:403423516639:web:31a02b686b40df0a51166a"
};

// try {
//     const docRef = await addDoc(collection(db, "users"), {
//         first: "Ada",
//         last: "Lovelace",
//         born: 1815
//     });
//     console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//     console.error("Error adding document: ", e);
// }
//
// const querySnapshot = await getDocs(collection(db, "tableCollection"));
// querySnapshot.forEach((doc) => {
//     console.log(`${doc.id} => ${doc.data().Tasks}`);
// });

// const d = await doc(db, "tableCollection", "table1", "Tasks", "task1");
// console.log(d);
//
// let fff = initializeApp(firebaseConfig);
// let c = getFirestore(fff);
//
// const g = await doc(c, "tableCollection", "table1");
//
// const h = await getDocs(collection(g, "Tasks"));
// h.forEach((i) => {
//     console.log(i.id);
// });

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
    // let temp = "";
    // dataMap.forEach((value, key) => {
    //     console.log(key, value);
    //     temp += ` <div class="table-item column" id="${key}">
    //     <div class="table-item-head row">
    //         <button class="close-button">
    //             <img src="img/close.svg" alt="exit">
    //         </button>
    //     </div>
    //     <div class="table-item-content column">`
    //     value.forEach((itemValue, itemKey) => {
    //         temp += `<div class="task-item row" id="${itemKey}">
    //             <div class="task-text">
    //                 ${itemValue}
    //             </div>
    //             <div class="task-item-tools column">
    //                 <button class="edit-button">
    //                     <img src="img/editButton.png"  alt="edit">
    //                 </button>
    //                 <button class="delete-button">
    //                     <img src="img/deleteButton.png" alt="delete">
    //                 </button>
    //             </div>
    //         </div>`;
    //     });
    //     temp += `</div>
    //     <div class="table-item-bottom">
    //         <button class="add-new-task">
    //             Add
    //         </button>
    //     </div>
    // </div>`;
    // });
    // main.innerHTML = temp;
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
            const main = document.getElementById('main');
            main.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('add-new-task')) {
                    this.addTask(target.parentNode.parentNode.id, "New Task");
                }
                if (target.parentNode.classList.contains('edit-button')) {
                    let text = target.parentNode.parentNode.previousSibling.previousSibling.textContent;
                    target.parentNode.parentNode.previousSibling.previousSibling.outerHTML = `<textarea class="task-text">
                    ${text} </textarea>`;
                }
            });
            // tw.addEventListener('click', (e) => {
            //     const target = e.target.parentNode;
            //     if (target.classList.contains('countOfComments')) {
            //         if (target.parentNode.classList.contains('twitComment')) {
            //             this.showTweet(target.parentNode.parentNode.id);
            //         }
            //         this.showTweet(target.parentNode.parentNode.parentNode.id);
            //     }
            //     if (target.classList.contains('editButton')) {
            //         target.parentNode.parentNode.parentNode.style = 'opacity: 0.4';
            //         const newTweetButtonCase = document.getElementById('newTweetButtonCase');
            //         newTweetButtonCase.innerHTML = `<button class="confirmEdit">Save</button>
            //         <button class="resetEdit">Cancel</button>`;
            //         newTweetButtonCase.addEventListener('click', (event) => {
            //             const secondTarget = event.target;
            //             const text = document.getElementById('newTweetArea').value;
            //             if (secondTarget.classList.contains('confirmEdit')) {
            //                 this.editTweet(target.parentNode.parentNode.parentNode.id, `${text}`);
            //                 document.getElementById('newTweet').innerHTML = `<textarea id="newTweetArea"></textarea>
            //     <div class="row" id="newTweetButtonCase">
            //         <input type="button" value="Tweet!" class="twitButton">
            //     </div>`;
            //             }
            //         });
            //     }
            //     if (target.classList.contains('deleteButton')) {
            //         const secondTarget = target.parentNode.parentNode;
            //         secondTarget.classList.add('deleted');
            //         const temp = secondTarget.getElementsByTagName('p')[0];
            //         secondTarget.innerHTML = `<p>Delete?</p>
            //             <div class="row" class="deleteButtonCase">
            //                 <button class="resetDelete">No</button>
            //                 <button class="confirmDelete">Yes</button>
            //             </div>`;
            //         secondTarget.addEventListener('click', (event) => {
            //             if (event.target.classList.contains('confirmDelete')) {
            //                 this.removeTweet(secondTarget.parentNode.id);
            //             }
            //             if (event.target.classList.contains('resetDelete')) {
            //                 this.getFeed(0, indexOfLoadTweets);
            //             }
            //         });
            //     }
            // });
            // const newTw = document.getElementById('newTweet');
            // newTw.addEventListener('click', (e) => {
            //     if (e.target.classList.contains('twitButton')) {
            //         const text = document.getElementById('newTweetArea').value;
            //         this.addTweet(text);
            //         this.getFeed(0, indexOfLoadTweets);
            //     }
            // });
        });
    }

    getTableFeed() {
        console.log(this.#firestoreService.getTableFeed());
        return this.#firestoreService.getTableFeed();
    }

    getTable() {
        return this.#firestoreService.getTable();
    }

    addTable(tableId, taskText) {
        this.#firestoreService.addTable(tableId, taskText);
        tableFeedRender(this.#firestoreService.getTableFeed(), "main");
    }

    deleteTable(id) {
        this.#firestoreService.delete(id);
        tableFeedRender(this.#firestoreService.getTableFeed(), "main");
    }

    addTask(tableId, taskText) {
        this.#firestoreService.addTask(tableId, taskText);
        tableRender(this.#firestoreService.getTable(tableId), `${tableId}`);
    }

    deleteTask(tableId, taskId) {
        this.#firestoreService.deleteTask(tableId, taskId);
        tableRender(this.#firestoreService.getTable(tableId), `${tableId}`);
    }

    editTask(tableId, taskId, newText) {
        this.#firestoreService.editTask(tableId, taskId, newText);
        tableRender(this.#firestoreService.getTable(tableId), `${tableId}`);
    }
}

class FirestoreService {
    #app;
    #db;

    constructor(config) {
        this.#app = initializeApp(config);
        this.#db = getFirestore(this.#app);
    }

    async getTableFeed() {
        let tableCollection = new Map;
        const tempTableDoc = query(collection(this.#db, 'tableCollection'));
        await onSnapshot(tempTableDoc, (apiCollectionDocs) => {
            apiCollectionDocs.forEach((viewItem) => {
                const documentsCollection = query(
                    collection(this.#db, 'tableCollection', viewItem.id, 'Tasks')
                );
                let tasksCollection = new Map;
                onSnapshot(documentsCollection, (subCollectionsName) => {
                    subCollectionsName.forEach((item) => {
                        console.log(`${item.id} + ${item.data().text}`);
                        tasksCollection.set(item.id, item.data().text);
                    });
                });
                tableCollection.set(viewItem.id, tasksCollection);
            });
        });
        return tableCollection;
    }

    getTable(tableId) {
        const documentsCollection = query(
            collection(this.#db, 'tableCollection', tableId, 'Tasks')
        );
        let tasksCollection = new Map;
        onSnapshot(documentsCollection, (subCollectionsName) => {
            subCollectionsName.forEach((item) => {
                console.log(`${item.id} + ${item.data().text}`);
                tasksCollection.set(item.id, item.data().text);
            });
        });
        return tasksCollection;
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
// a.deleteTable('OGW0mrsSwDwmNiSYIziq');
// a.addTask('table1', 'mdkcmsdk');
// a.deleteTask('table1', 'Task1');
// a.editTask('table1', 'jpICh74EfmrFwwBJIjsg', '211');
// console.log(a.getTableFeed());
let myMap = new Map;
let table1 = new Map;
let table2 = new Map;
table1.set("task1", "dksod");
table1.set("task2", "dkfkds");
table2.set("task1", "dksodsdsfdd");
table2.set("task2", "dkfkdsfdsdffjkdhsfjksdhfjkdfhsdifhdoifdsывлофытволытволтолыфтволфытволытвлофытвлофытлофвтфолвтфыолтвфыолhuoifhdsoifjsdoifjdsoifjsdfs");
myMap.set('table1', table1);
myMap.set('table2', table2);
// tableFeedRender(myMap, "main");
tableFeedRender(a.getTableFeed(), 'main');
