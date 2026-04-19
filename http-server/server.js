import { createServer } from "http";
import { parse } from "url";

let toDoList = [];
let id = 1;

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  let urlobj = parse(req.url, true);
  let { pathname, query } = urlobj;

  if (req.method == "POST" && pathname == "/create/todo") {
    let body = "";
    req.on("data", (chunk) => {
      body = body + chunk;
    });

    req.on("end", () => {
      let { title, description } = JSON.parse(body || "");
      let newTodo = { id: id++, title: title, description: description };
      toDoList.push(newTodo);
      sendJson(res, 200);
    });
  }

  if (req.method == "GET" && pathname == "/todos") {
    let todos = toDoList;

    sendJson(res, 200, todos);
  }

  if (req.method == "GET" && pathname == "/todo") {
    let id = query.id;
    let todo = toDoList.find((ele) => ele.id == id);

    if (!todo) {
      sendJson(res, 404, { error: "Todo not found" });
    } else {
      sendJson(res, 200, todo);
    }
  }

  if (req.method == "DELETE" && pathname == "/todo") {
    let id = query.id;
    let index = toDoList.findIndex((ele) => ele.id == id);
    if (index < 0) {
      sendJson(res, 404, { error: "Todo Not Found" });
    } else {
      toDoList = toDoList.splice(index, 1);
      sendJson(res, 200, { success: "Todo not found" });
    }
  }
});

server.listen(3000, () => {
  console.log("listening to port 3000 ");
});
