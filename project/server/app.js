const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3000);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 디렉토리에 있는 정적 파일 제공

// 루트 경로에 접근할 때 index.html 파일을 전송
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log(`Serving index from: ${indexPath}`); // 로그 추가
    res.sendFile(indexPath);
});

// 기존의 다른 라우트는 그대로 유지
app.get('/data', (req, res) => {
    const user = req.query.user;
    const message = req.query.message;
    const jsonData = { user, message };

    res.send(jsonData);
});



var noSeq = 106;

// 검색
app.get('/todo/search', (req, res) => {
    var keyword = req.query.keyword;
    var newTodoList = todoList.filter((todo) => {
        return todo.title.indexOf(keyword) != -1; // findIndex를 indexOf로 변경
    });
    res.send(newTodoList);
});

// 상세보기 or 전체보기
app.get('/index', (req, res) => {
    if (req.query.no) {
        var no = req.query.no;
        var idx = todoList.findIndex((t) => {
            return t.no == no;
        });
        if (idx != -1) {
            res.send(todoList[idx]);
        } else {
            res.send(null);
        }
        return;
    }

    res.send(todoList);
});

// 입력
app.post('/index', (req, res) => {
    var title = req.body.title;
    todoList.push({ no: noSeq++, title, done: false });
    res.send(todoList);
});

// 수정
app.put('/index', (req, res) => {
    var todo = req.body;
    console.dir(todo);
    var idx = todoList.findIndex((t) => {
        return t.no == todo.no;
    });
    if (idx != -1) {
        todoList[idx] = todo;
    }

    res.send(todoList);
});

// 삭제
app.delete('/index', (req, res) => {
    var no = parseInt(req.body.no);
    var idx = todoList.findIndex((t) => {
        return t.no == no;
    });
    if (idx != -1) {
        todoList.splice(idx, 1);
    }
    res.send(todoList);
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`노드js 서버 실행 중 >>> http://localhost:${app.get('port')}`);
});
