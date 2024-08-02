// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdHiP3Fi9GXw7mlGmggHvv6l9mGiio__s",
  authDomain: "project-aa48a.firebaseapp.com",
  projectId: "project-aa48a",
  storageBucket: "project-aa48a.appspot.com",
  messagingSenderId: "823484935420",
  appId: "1:823484935420:web:6cf4543346b17ceb86bb79",
  measurementId: "G-LFRW2DYNSB",
  databaseURL: "https://project-aa48a-default-rtdb.asia-southeast1.firebasedatabase.app/" // 추가된 databaseURL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Function to submit a comment
function submitComment(comment) {
  console.log('Submitting comment:', comment);  // 디버깅용 로그 추가
  const commentsRef = ref(database, 'comments');
  push(commentsRef, {
    text: comment,
    timestamp: Date.now()
  }).then(() => {
    console.log('Comment submitted successfully');  // 디버깅용 로그 추가
  }).catch((error) => {
    console.error('Error submitting comment:', error);  // 에러 로그 추가
  });
}

// Function to load comments
function loadComments() {
  console.log('Loading comments...');  // 디버깅용 로그 추가
  const commentsRef = ref(database, 'comments');
  onValue(commentsRef, (snapshot) => {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = ''; // Clear previous comments
    const comments = snapshot.val();
    if (comments) {
      for (let key in comments) {
        const comment = comments[key];
        const commentElement = document.createElement('p');
        commentElement.textContent = comment.text;
        commentsContainer.appendChild(commentElement);
      }
    } else {
      console.log('No comments found');  // 디버깅용 로그 추가
    }
  }, (error) => {
    console.error('Error loading comments:', error);  // 에러 로그 추가
  });
}

// Load comments when the page loads
window.onload = function() {
  loadComments();

  document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const commentInput = document.getElementById('commentInput');
    submitComment(commentInput.value);
    commentInput.value = ''; // Clear input field
  });
}
