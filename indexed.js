var databox, db;
function initiate(){
    databox = document.getElementById('databox');
    var button = document.getElementById('save');
    button.addEventListener('click', addobject);

    var request = indexedDB.open('mydatabase');
    request.addEventListener('error', showerror);
    request.addEventListener('success', start);
    request.addEventListener('upgradeneeded', createdb);
}
function showerror(e){
    alert('Error: ' + e.code + ' ' + e.message);
}
function start(e){
    db = e.target.result;
    show();
}
function createdb(e){
    var datababase = e.target.result;
    var mystore = datababase.createObjectStore('movies', {keyPath: 'id'});
    mystore.createIndex('SearchYear', 'date', {unique: false});
}
function addobject(){
    var keyword = document.getElementById('keyword').value;
    var title = document.getElementById('text').value;
    var year = document.getElementById('year').value;

    var mytransaction = db.transaction(['movies'], "readwrite");
    var mystore = mytransaction.objectStore('movies');
    mytransaction.addEventListener('complete', show);

    var request = mystore.add({id: keyword, name: title, date: year});
    document.getElementById('keyword').value = '';
    document.getElementById('text').value = '';
    document.getElementById('year').value = '';
}
function show(){
    databox.innerHTML = '';
    var mytransaction = db.transaction(['movies']);
    var mystore = mytransaction.objectStore('movies');
    var newcursor = mystore.openCursor();
    newcursor.addEventListener('success', showlist);
}
function showlist(e){
    var cursor = e.target.result;
    if(cursor){
        databox.innerHTML += '<div>' + cursor.value.id + ' - ' + cursor.value.name + ' - ' + cursor.value.date + '</div>';
        cursor.continue();
    }
}
addEventListener('load', initiate);