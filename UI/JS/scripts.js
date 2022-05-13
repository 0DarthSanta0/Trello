import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js'
import { getFirestore, collection, getDocs, addDoc} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyDhNAj5vXDe3GNb1rj9ES0puJNpn80UPkY",
    authDomain: "trello2-0.firebaseapp.com",
    projectId: "trello2-0",
    storageBucket: "trello2-0.appspot.com",
    messagingSenderId: "403423516639",
    appId: "1:403423516639:web:31a02b686b40df0a51166a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
//     console.log(`${doc.id} => ${doc.data().task1}`);
// });

class tableFeedView {
    #div;

    constructor(elementId) {
        this.#div = document.getElementById(elementId);
    }

    display() {

    }
}

class tableView {
    #div;

    constructor(elementId) {
        this.#div = document.getElementById(elementId);
    }

    display(table = {}) {

    }
}


