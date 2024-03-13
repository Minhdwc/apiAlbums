const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const imgsPerPage = 500;
let currentPage = 1;
var listImgsBlock = $('#list-posts')
var total = 0;

var imgApi = 'https://jsonplaceholder.typicode.com/photos';

function Start() {
    getImgs(renderImgs);
    handleCreateForm();
    handlePagination(total);
}

Start();


function crerateImg(data, callback) {
    fetch(imgApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (res) {
            return res.json();
        })
        .then(callback)
}

function handleDeleteImg(id) {
    fetch(imgApi + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            res.json();
        })
        .then(function () {
            var imgItem = $('.post-item-' + id)
            if (imgItem) {
                imgItem.remove();
            }
        });
}

function deleteImg(id) {
    handleDeleteImg(id)
}

function renderImgs(imgs) {
    var listImgBlock = $('#list-posts');
    var startIndex = (currentPage - 1) * imgsPerPage;
    var endIndex = startIndex + imgsPerPage;
    var paginatedImgs = imgs.slice(startIndex, endIndex);

    var htmls = paginatedImgs.map(function (img) {
        return `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${img.url}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${img.id}</h5>
                <p class="card-text">${img.title}</p>
                <a href="deleteImg(${img.id})" class="btn btn-danger">Xóa</a>
            </div>
        </div>
        `;
    });

    listImgBlock.innerHTML = htmls.join('');
}


function handleCreateForm() {
    var btnCreate = $("#btncreate")

    btnCreate.onclick = function () {
        var title = $('input[name="title"]').value;
        var body = $('input[name="body"]').value;

        var formdata = {
            title: title,
            body: body
        }


        console.log("Thực hiện action create Img với Title= " + title, "body= " + body)

        crerateImg(formdata, function () {
            getImgs(renderImgs);
        })
    };
}


function handlePagination(totalImgs) {
    var totalPages = Math.ceil(totalImgs / imgsPerPage);
    var paginationHTML = '';

    for (var i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="btn btn-outline-primary" onclick="goToPage(${i})">${i}</button>`;
    }

    $('#pagination').innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    $('#page').innerHTML = "Bạn đang ở page " + page;
    getImgs(renderImgs);
}

function getImgs(callback) {
    fetch(imgApi)
        .then(res => res.json())
        .then(imgs => {
            total = imgs.length;
            callback(imgs);
            handlePagination(imgs.length);
        });
}