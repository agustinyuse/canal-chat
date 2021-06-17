const PRODUCTS_TEMPLATE = `{{#each products}}
<tr> <th scope="row">{{this.id}}</th> <td>{{this.title}}</td> <td>{{this.price}}</td>
<td><img src="{{this.thumbnail}}" alt="Imagen del producto"
class="rounded-sm" style="width: 50px;" /></td> </tr>
{{/each}}`;

const MESSAGES_TEMPLATE = `{{#each messages}}
        <div class="d-flex">
          <label class="label text-primary">{{this.email}}</label>
          <label class="label text-danger">[{{this.date}}] : </label>
          <label class="label text-success"><i> {{this.message}}</i></label>
        </div>
{{/each}}
`;

fetch("/api/mensajes/leer", {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((respuesta) => respuesta.json())
  .then((messages) => {
    if (!messages || messages.length === 0) {
      return;
    }
    const template = Handlebars.compile(MESSAGES_TEMPLATE);
    document.getElementById("messagesContainer").innerHTML = template({
      messages: messages,
    });

    console.log(document.getElementById("messagesContainer").innerHTML);
  })
  .catch((error) => console.error(error));

const socket = io.connect();

const formatearFecha = (f) =>
  `${f.getDate()}-${
    f.getMonth() + 1
  }-${f.getFullYear()} ${f.getHours()}: ${f.getMinutes()}:${f.getSeconds()}`;

document
  .getElementById("btnSaveProduct")
  .addEventListener("click", function (event) {
    const product = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value,
    };

    fetch("/api/productos/guardar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(product),
    })
      .then((respuesta) => respuesta.json())
      .then((products) => {
        form.reset();
        const template = Handlebars.compile(PRODUCTS_TEMPLATE);
        document.getElementById("productsContainer").innerHTML =
          template(products);
      })
      .catch((error) => console.error(error));
  });

socket.on("products", (products) => {
  const template = Handlebars.compile(PRODUCTS_TEMPLATE);
  document.getElementById("productsContainer").innerHTML = template(products);
});

document
  .getElementById("btnSaveMessage")
  .addEventListener("click", function (event) {
    if (
      document.getElementById("txtEmail").value === "" ||
      document.getElementById("txtMessage").value === ""
    ) {
      return;
    }

    const message = {
      email: document.getElementById("txtEmail").value,
      date: formatearFecha(new Date()),
      message: document.getElementById("txtMessage").value,
    };

    fetch("/api/mensajes/guardar", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(message),
    })
      .then((respuesta) => respuesta.json())
      .then((messages) => {
        if (!messages || messages.length === 0) {
          return;
        }
        document.getElementById("txtMessage").value = "";
        const template = Handlebars.compile(MESSAGES_TEMPLATE);
        document.getElementById("messagesContainer").innerHTML = template({
          messages: messages,
        });

        console.log(document.getElementById("messagesContainer").innerHTML);
      })
      .catch((error) => console.error(error));
  });

socket.on("messages", (messages) => {
  const template = Handlebars.compile(MESSAGES_TEMPLATE);
  document.getElementById("messagesContainer").innerHTML = template({
    messages: messages,
  });
});
