const startBtn = document.getElementById("btn");
const clearOutputBtn = document.getElementById("clear-output");
const loader = document.getElementById("loader");

const beautify = (value) => JSON.stringify(value, null, 4);

window.onload = function () {
  const form = document.forms["payment"];
  const lsToken = localStorage.getItem("token");
  const lsUrl = localStorage.getItem("url");
  const lsBaseUrl = localStorage.getItem("baseUrl");
  const lsBody = localStorage.getItem("body");
  const lsMethod = localStorage.getItem("method");
  const lsOutput = localStorage.getItem("output");

  if (lsToken) {
    form.elements["bearer"].value = lsToken;
  }

  if (lsUrl) {
    form.elements["url"].value = lsUrl;
  }

  if (lsBaseUrl) {
    form.elements["baseUrl"].value = lsBaseUrl;
  }

  if (lsBody) {
    form.elements["body"].value = lsBody;
  }

  if (lsMethod) {
    form.elements["method"].value = lsMethod;
  }

  if (lsOutput) {
    const display = document.getElementById("result");
    display.textContent = lsOutput;
  }
};

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.forms["payment"];
  const url = form.elements["url"].value;
  const baseUrl = form.elements["baseUrl"].value;
  const method = form.elements["method"].value;
  let body = form.elements["body"].value;
  const token = form.elements["bearer"].value;

  const display = document.getElementById("result");

  localStorage.setItem("token", token);
  localStorage.setItem("url", url);
  localStorage.setItem("baseUrl", baseUrl);
  localStorage.setItem("body", body);
  localStorage.setItem("method", method);

  if (body.trim()) {
    body = JSON.parse(body);
    body = JSON.stringify(body);
  }

  loader.style.visibility = "visible";
  startBtn.disabled = true;

  if (method === "GET") {
    body = undefined;
  }

  fetch(baseUrl + url, {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      redirect: "follow",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      loader.style.visibility = "hidden";
      startBtn.disabled = false;
      const output = beautify(data);
      localStorage.setItem("output", output);
      display.textContent = output;
    })
    .catch((error) => {
      loader.style.visibility = "hidden";
      startBtn.disabled = false;
      alert("Request failed");
      console.error(error);
    });
});

clearOutputBtn.addEventListener("click", (e) => {
  const display = document.getElementById("result");
  display.textContent = "";
  localStorage.removeItem("output");
});

