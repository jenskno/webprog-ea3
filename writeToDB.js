/**
 * Created by jens on 22.11.15.
 */
























//    function writeToDB(ang){
var openDbRequest =    window.indexedDB.open("RezeptDB")
    || window.webkitIndexedDB.open("RezeptDB")
    || window.mozIndexedDB.open("RezeptDB");

var db;
console.log("Was steht drin" + " " +
    ang[0]["Rezeptname"] +
    " | " + ang[0]["Autorname"] +
    " | " + ang[0]["Speiseart"] +
    " | " + ang[0]["Speisetyp"] +
    " | " + ang[0]["Zutat"]);

// Erfolgsfall der DB-Anbindung
openDbRequest.onsuccess = function()
{
    // result enthält das ergebnis der erstellung
    db = this.result;
    // wenn fehler, dann iwas machen
    db.onerror = function(event)
    {
        console.log(event);
    };
};

openDbRequest.onupgradeneeded = function()
{
    db = openDbRequest.result;

    var objectStore = db.createObjectStore(
        'recipes',
        {
            keyPath: 'id',
            autoIncrement: true
        }
    );


    objectStore.createIndex('byId', 'id', {unique: true});

    objectStore.add(
        {
            rezeptname: ang[0]["Rezeptname"],
            autorname: ang[0]["Autorname"],
            apeiseart: ang[0]["Speiseart"],
            speisetyp: ang[0]["Speisetyp"],
            zutaten: ang[0]["Zutat"]

        });
}


// Fehlerfall der DB-Anbindung
openDbRequest.onerror = function(event)
{
    console.log(event);
    alert("openDbRequest onerror");
};
return true;
}
